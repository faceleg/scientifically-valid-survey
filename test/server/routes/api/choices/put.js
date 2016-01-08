'use strict';

var request = require('supertest');
var expect = require('code').expect;

describe('routes api choices PUT', function() {

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
      })
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
    .put('/api/choices/1')
    .set('authorization', jwtToken)
    .send({
      questionId: 1
    })
    .expect(400, 'Choice text must be provided')
    .end(done);
  });

  it('should respond with a 400 if missing questionId', function(done) {
    request(app)
    .put('/api/choices/1')
    .set('authorization', jwtToken)
    .send({
      text: 'This is some text'
    })
    .expect(400, 'Question ID must be provided')
    .end(done);
  });

  it('should respond with a 404 if the choice does not exist', function(done) {
    request(app)
    .put('/api/choices/1')
    .set('authorization', jwtToken)
    .send({
      text: 'This is some text',
      questionId: 1
    })
    .expect(404, 'Choice does not exist')
    .end(done);
  });

  it('should respond with the updated choice', function(done) {
    var question;
    models.question.build({
      text: 'This is a question'
    })
    .save()
    .then(function(_question_) {
      question = _question_;
      return models.choice.build({
        questionId: question.id,
        text: 'choice text'
      })
      .save();
    })
    .then(function(choice) {
      request(app)
      .put('/api/choices/' + choice.id)
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

  it('should respond with a 400 if given bad input', function(done) {
    var question;
    models.question.build({
      text: 'This is a question'
    })
    .save()
    .then(function(_question_) {
      question = _question_;
      return models.choice.build({
        questionId: question.id,
        text: 'choice text'
      })
      .save();
    })
    .then(function(choice) {
      request(app)
      .put('/api/choices/' + choice.id)
      .set('authorization', jwtToken)
      .send({
        text: 123123123987129837918273987123987129873,
        questionId: question.id
      })
      .expect(400, function() {
        done();
      });
      return null;
    });
  });
});
