'use strict';

var request = require('supertest');
var expect = require('code').expect;
var Plan = require('test-plan');
var app;

describe('routes authentication login', function() {

  beforeEach(function(done) {
    require('../../loginHelper.js')()
    .then(function(result) {
      app = result.app;
      done();
    });
  });

  afterEach(function(done) {
    require('../../../../server/models/index.js')
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

  it('should reject invalid login attempts', function(done) {
    var plan = new Plan(2, done);
    request(app)
      .post('/authentication/login')
      .expect(401)
      .expect({
        code: 401,
        message: 'Invalid email or password'
      }, function() {
        plan.ok(true);
      });

    request(app)
      .post('/authentication/login')
      .send({
        email: 'inactive@svs.com',
        password: 'invalid password'
      })
      .expect(401)
      .expect({
        code: 401,
        message: 'Invalid email or password'
      }, function() {
        plan.ok(true);
      });
  });

  it('should return a JWT token', function(done) {
    request(app)
      .post('/authentication/login')
      .send({
        email: 'active@svs.com',
        password: '12345'
      })
      .expect(200)
      .end(function(error, response) {
        if (error) {
          throw error;
        }
        var jwtToken = JSON.parse(response.text); // eslint-disable-line angular/json-functions
        expect(jwtToken.token).to.exist();
        done();
      });
  });
});
