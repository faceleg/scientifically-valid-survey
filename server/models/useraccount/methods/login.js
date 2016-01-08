'use strict';

var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
var debug = require('debug')('login');
var InvalidLoginDetailsError = require('../../../errors/InvalidLoginDetailsError.js');
var TooManyAttemptsError = require('../../../errors/TooManyAttemptsError.js');

var UserAccountStatuses = require('../../enum/statuses.js');

var MAX_LOGIN_ATTEMPTS = 5;
var LOCK_TIME = 2 * 60 * 60 * 1000;

module.exports = {
  login: login,
  isLocked: isLocked,
  incrementLoginAttempts: incrementLoginAttempts,
  InvalidLoginDetailsError: InvalidLoginDetailsError,
  TooManyAttemptsError: TooManyAttemptsError
};

function incrementLoginAttempts(user) {
  return new Promise(function(resolve, reject) {
    // if we have a previous lock that has expired, restart at 1
    if (user.lockUntil && user.lockUntil < Date.now()) {
      user.loginAttempts = 1;
      user.lockUntil = null;
    // lock the account if we've reached max attempts and it's not locked already
    } else if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS && !user.isLocked()) {
      user.loginAttempts += 1;
      user.lockUntil = Date.now() + LOCK_TIME;
    } else {
      user.loginAttempts += 1;
    }

    user.save()
      .then(resolve)
      .catch(reject);
  });
}

function isLocked(user) {
  return !!(user.lockUntil && user.lockUntil > Date.now());
}

function login(useraccount) {
  return function(email, password) {
    return new Promise(function(resolve, reject) {
      useraccount.findOne({
        where: {
          email: email
        }
      })
      .then(function(user) {
        if (!user) {
          debug('%s not found', email);
          return reject(new InvalidLoginDetailsError());
        }

        if (user.status !== UserAccountStatuses.ACTIVE) {
          debug('%s is not active', email);
          return reject(new InvalidLoginDetailsError());
        }

        if (user.isLocked()) {
          debug('%s is locked', email);
          // just increment login attempts if account is already locked
          return user.incrementLoginAttempts()
            .then(function() {
              debug('%s login attempts incremented', email);
              return reject(new TooManyAttemptsError());
            });
        }

        bcrypt.compare(password, user.password, function(error, result) {
          if (error) {
            debug('error comparing password for %s', email);
            return reject(error);
          }

          if (!result) {
            debug('%s provided invalid password', email);
            return user.incrementLoginAttempts()
              .then(function(incrementedUserAccount) {
                if (incrementedUserAccount.isLocked()) {
                  debug('%s has been locked', email);
                  return reject(new TooManyAttemptsError());
                } else {
                  return reject(new InvalidLoginDetailsError());
                }
              });
          }

          resolve(user);
        });
        return null;
      })
      .catch(reject);
    });
  };
}

