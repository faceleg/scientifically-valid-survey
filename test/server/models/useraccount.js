'use strict';

var expect = require('code').expect;

describe('useraccount', function() {

  var useraccount = null;
  var models;
  beforeEach(function(done) {
    require('../../../server/models/index.js')
    .then(function(result) {
      models = result;
      useraccount = models.useraccount;
      done();
      return null;
    });
  });

  afterEach(function(done) {
    models.useraccount.destroy({
      force: true,
      truncate: true,
      cascade: true
    })
    .then(function() {
      done();
      return null;
    });
  });

  it('should not hash the password when updating an instance without changing the password', function(done) {
    var password;
    useraccount.build({
      name: 'Test Name',
      email: 'not_hash_password@66pix.com',
      password: 'another test password',
      updatedWithToken: -1
    })
    .save()
    .then(function(user) {
      password = user.password;
      user.name = 'Another Name';
      user.save()
      .then(function() {
        expect(password).to.equal(user.password);
        return user.destroy({
          force: true
        });
      })
      .then(function() {
        done();
        return null;
      });
      return null;
    });
  });

  it('should have a login class method', function(done) {
    useraccount.login('email', 'password')
    .catch(function(error) {
      expect(error).to.be.an.instanceof(Error);
      done();
      return null;
    });
  });

});

