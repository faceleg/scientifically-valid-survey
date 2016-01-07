'use strict';

var Promise = require('bluebird');
var bcrypt = require('bcryptjs');

module.exports = function(User) {
  function hashPassword(instance) {
    return new Promise(function(resolve, reject) {
      if (!instance.changed('password')) {
        return resolve();
      }
      bcrypt.hash(instance.get('password'), 12, function(error, hash) {
        if (error) {
          return reject(error);
        }
        instance.set('password', hash);
        resolve();
      });
    });
  }

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);

  return hashPassword;
};

