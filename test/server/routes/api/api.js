'use strict';

var request = require('supertest');

describe('routes api authentication', function() {

  var app;
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

  it('should respond with a 401', function(done) {
    request(app)
    .get('/api')
    .expect(401, {
      message: 'No authorization token was found'
    })
    .end(done);
  });

});

