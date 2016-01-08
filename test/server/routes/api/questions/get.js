'use strict';

var request = require('supertest');

describe('routes api questions GET', function() {

  var app;
  var jwtToken;
  beforeEach(function(done) {
    require('../../../loginHelper.js')()
    .then(function(result) {
      app = result.app;
      jwtToken = result.token;
      done();
    });
  });

  afterEach(function(done) {
    require('../../../../../server/models/index.js')
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

  it('should respond with the correct object', function(done) {
    request(app)
      .get('/api/questions?orderBy=text&orderBy=desc&offset=1&limit=5')
      .set('authorization', jwtToken)
      .expect(200, {
        data: [],
        total: 0
      })
      .end(done);
  });

});
