'use strict';

var Promise = require('bluebird');
var request = require('supertest');

module.exports = function() {
  return new Promise(function(resolve) {
    var result = {};
    require('../../server/models/index.js')
    .then(function(models) {
      result.models = models;
      return models.useraccount.build({
        email: 'active@svs.com',
        name: 'this is a name',
        updatedWithToken: -1,
        password: '12345',
        status: 'Active'
      })
      .save();
    })
    .then(function(user) {
      result.user = user;
      return require('../../server/app.js');
    })
    .then(function(app) {
      result.app = app;
      request(app)
      .post('/authentication/login')
      .send({
        email: 'active@svs.com',
        password: '12345'
      })
      .expect(function(response) {
        result.token = 'Bearer ' + response.body.token;
      })
      .expect(200, function() {
        resolve(result);
      });

      return null;
    })
    .catch(function(error) {
      throw error;
    });
  });
};
