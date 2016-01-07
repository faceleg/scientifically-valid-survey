'use strict';

var expect = require('code').expect;
var isRevoked = require('../../server/isRevoked.js');
var sinon = require('sinon');
var spy;

describe('isRevoked', function() {

  beforeEach(function(done) {
    spy = sinon.spy();
    done();
  });

  it('should call done with true if the argument is null', function(done) {
    isRevoked(null, null, spy);
    expect(spy.calledWith(null, true)).to.equal(true);
    done();
  });

  it('should call done with true if the token is not present in the database', function(done) {
    var tokenId;
    var models;
    require('../../server/models/index.js')
    .then(function(_models_) {
      models = _models_;
      return models.token.build({
        userId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: true,
        payload: '',
        updatedWithToken: -1
      }).save();
    })
    .then(function(token) {
      tokenId = token.id;
      return models.token.destroy({
        force: true,
        truncate: true
      });
    })
    .then(function() {
      isRevoked(null, {
        tokenId: tokenId
      }, function(error, revoked) {
        if (error) {
          throw error;
        }
        expect(revoked).to.equal(true);
        done();
      });
      return null;
    });
  });

  it('should call done with true if the matching token record isRevoked', function(done) {
    require('../../server/models/index.js')
    .then(function(models) {
      return models.token.build({
        userId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: true,
        payload: '',
        updatedWithToken: -1
      }).save();
    })
    .then(function(token) {
      isRevoked(null, {
        tokenId: token.id
      }, function(error, revoked) {
        if (error) {
          throw error;
        }
        expect(revoked).to.equal(true);
        done();
      });
      return null;
    });
  });

  it('should call done with false if the matching token record is not revoked', function(done) {
    require('../../server/models/index.js')
    .then(function(models) {
      return models.token.build({
        userId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: false,
        payload: '',
        updatedWithToken: -1
      }).save();
    })
    .then(function(token) {
      isRevoked(null, {
        tokenId: token.id
      }, function(error, revoked) {
        if (error) {
          throw error;
        }
        expect(revoked).to.equal(false);
        done();
      });
      return null;
    });
  });
});

