'use strict';

var request = require('supertest');
var expect = require('code').expect;

describe('app', function() {

  var app;
  beforeEach(function(done) {
    require('./loginHelper.js')()
    .then(function(result) {
      app = result.app;
      done();
    });
  });

  afterEach(function(done) {
    require('../../server/models/index.js')
    .then(function(models) {
      return models.useraccount.destroy({
        force: true,
        truncate: true,
        cascade: true
      });
    })
    .then(function() {
      done();
      return null;
    })
    .catch(function(error) {
      throw error;
    });
  });

  it('should serve index.html if no other route succeeds', function(done) {
    request(app)
      .get('/not-a-real-route')
      .expect(200, function(error, response) {
        if (error) {
          throw error;
        }
        expect(/ng-app="svs"/.test(response.text)).to.equal(true);
        done();
      });
  });
});

