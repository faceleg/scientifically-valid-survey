'use strict';

var expect = require('code').expect;

describe('useraccount login', function() {

  var useraccount = null;
  var loginMethods;
  var login = null;
  var isLocked = null;
  var incrementLoginAttempts = null;
  var user = null;

  var email = 'useirlogin@svs.com';
  var password = 'useraccount/methods/login';
  beforeEach(function(done) {
    require('../../../../../server/models/index.js')
    .then(function(result) {
      useraccount = result.useraccount;

      loginMethods = require('../../../../../server/models/useraccount/methods/login.js');
      login = loginMethods.login(useraccount);
      isLocked = loginMethods.isLocked;
      incrementLoginAttempts = loginMethods.incrementLoginAttempts;

      useraccount.build({
        email: email,
        name: 'name',
        status: 'Active',
        password: password,
        updatedWithToken: -1
      })
      .save()
      .then(function(_user_) {
        user = _user_;
        done();
        return null;
      })
      .catch(function(error) {
        throw error;
      });
      return null;
    });
  });

  afterEach(function(done) {
    user.destroy({
      force: true
    })
    .then(function() {
      done();
      return null;
    });
  });

  describe('login', function() {
    it('should export the correct properties', function(done) {
      expect(loginMethods.login).to.be.instanceof(Function);
      expect(loginMethods.isLocked).to.be.instanceof(Function);
      expect(loginMethods.incrementLoginAttempts).to.be.instanceof(Function);
      expect(new loginMethods.InvalidLoginDetailsError()).to.be.instanceof(Error);
      expect(new loginMethods.TooManyAttemptsError()).to.be.instanceof(Error);
      done();
    });

    it('should return a promise', function() {
      expect(login(email, password)).to.be.an.object();
    });

    it('should resolve with the correct user', function(done) {
      login(email, password).then(function(loggedInuseraccount) {
        expect(loggedInuseraccount.email).to.be.equal(email);
        done();
      });
    });

    it('should reject with the correct error if no valid user is found', function(done) {
      login(email + email, password).catch(function(error) {
        expect(error).to.be.instanceof(Error);
        expect(error.code).to.be.equal(401);
        expect(error.message).to.be.equal('Invalid email or password');
        done();
      });
    });

    it('should reject with the correct error if the user is not active', function(done) {
      user.status = 'Inactive';
      user.save()
      .then(function() {
        login(email, password).catch(function(error) {
          expect(error).to.be.instanceof(Error);
          expect(error.code).to.be.equal(401);
          expect(error.message).to.be.equal('Invalid email or password');
          done();
        });
        return null;
      });
    });

    it('should reject with the correct error if the given password is incorrect', function(done) {
      login(email, password + password).catch(function(error) {
        expect(error).to.be.instanceof(Error);
        expect(error.code).to.be.equal(401);
        expect(error.message).to.be.equal('Invalid email or password');
        done();
      });
    });

  });

  describe('isLocked', function() {
    it('should return false if the user has never been locked', function(done) {
      expect(isLocked(user)).to.be.false;
      done();
    });

    it('should return false if the user\'s lock has expired', function(done) {
      user.lockUntil = new Date();
      user.save()
      .then(function(saveduseraccount) {
        expect(isLocked(saveduseraccount)).to.be.false();
        done();
        return null;
      });
    });

    it('should return true if the user\'s lock has not expired', function(done) {
      var now = new Date();
      user.lockUntil = now.setDate(now.getDate() + 1);
      user.save()
      .then(function(saveduseraccount) {
        expect(isLocked(saveduseraccount)).to.be.true();
        done();
        return null;
      });
    });
  });

  describe('incrementLoginAttempts', function() {

    it('should increment loginAttempts field by 1 if there is no lock', function(done) {
      incrementLoginAttempts(user)
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(1);
        done();
        return null;
      });
    });

    it('should reset the loginAttempts field to 1 if there is an expired lock', function(done) {
      var now = new Date();
      user.lockUntil = now.setDate(now.getDate() - 1);
      user.save()
      .then(function() {
        incrementLoginAttempts(user)
        .then(function(incrementeduseraccount) {
          expect(incrementeduseraccount.loginAttempts).to.be.equal(1);
          done();
          return null;
        });
        return null;
      });
    });

    it('should lock the user if the maximum attempts have been reached', function(done) {
      incrementLoginAttempts(user)
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(1);
        return incrementLoginAttempts(incrementeduseraccount);
      })
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(2);
        return incrementLoginAttempts(incrementeduseraccount);
      })
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(3);
        return incrementLoginAttempts(incrementeduseraccount);
      })
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(4);
        return incrementLoginAttempts(incrementeduseraccount);
      })
      .then(function(incrementeduseraccount) {
        expect(incrementeduseraccount.loginAttempts).to.be.equal(5);
        expect(incrementeduseraccount.lockUntil > new Date());
        done();
        return null;
      });
    });
  });
});
