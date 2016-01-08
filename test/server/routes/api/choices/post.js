'use strict';

var request = require('supertest');
var expect = require('code').expect;

describe('routes api choices POST', function() {

  var app;
  var jwtToken;
  var models;
  beforeEach(function(done) {
    require('../../../loginHelper.js')()
    .then(function(result) {
      app = result.app;
      jwtToken = result.token;
      models = result.models;
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
      return models.question.destroy({
        force: true,
        where: {
          id: {
            $gt: 0
          }
        },
        cascade: true
      });
    })
    .then(function() {
      return models.choice.destroy({
        force: true,
        where: {
          id: {
            $gt: 0
          }
        },
        cascade: true
      })
    })
    .then(function() {
      done();
      return null;
    })
    .catch(function(error) {
      throw error;
    });
  });

  it('should respond with a 400 if missing choice text', function(done) {
    request(app)
      .post('/api/choices')
      .set('authorization', jwtToken)
      .send({
        questionId: 1
      })
      .expect(400, 'Choice text must be provided')
      .end(done);
  });

  it('should respond with a 400 if missing questionId', function(done) {
    request(app)
      .post('/api/choices')
      .set('authorization', jwtToken)
      .send({
        text: 'This is some text'
      })
      .expect(400, 'Question ID must be provided')
      .end(done);
  });

  it('should respond with the newly created choice', function(done) {
    models.question.build({
      text: 'This is a question'
    })
    .save()
    .then(function(question) {
      request(app)
      .post('/api/choices')
      .set('authorization', jwtToken)
      .send({
        text: 'This is some text',
        questionId: question.id
      })
      .expect(200, function(error, response) {
        expect(response.body.text).to.equal('This is some text');
        done();
      });
      return null;
    });
  });
});
