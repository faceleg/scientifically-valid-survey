'use strict';

var debug = require('debug')('sys:/api/questions');

module.exports = function(app) {
  app.get('/api/questions', function(req, res) {

    debug('Getting questions')

    require('../models/index.js')
    .then(function(models) {
      return models.question.findAll();
    })
    .then(function(questions) {
      questions = questions || [];
      debug('Responding with %s questions', questions.length);
      res.json(questions);
    });
  });

  app.get('/api/questions/random', function(req, res) {
    var models;
    require('../models/index.js')
    .then(function(_models_) {
      models = _models_;
      return models.sequelize.query([
        'SELECT q.id, q.text ',
        'FROM questions AS q ',

        'LEFT JOIN answers AS a ',
        'ON a.questionId = q.id ',
        'AND a.respondentId = $respondentId ',

        'WHERE a.id IS NULL ',

        'ORDER BY RAND() ',
        'LIMIT 1'
      ].join(''), {
        model: models.question,
        bind: {
          respondentId: req.session.respondentId
        }
      })
    })
    .then(function(question) {
      if (!question.length) {
        return res.status(404)
        .send('You have answered all of our scientific questions, thanks!');
      }
      return question[0].reload({
        include: [
          models.choice,
        ]
      });
    })
    .then(function(question) {
      res.json(question);
    });
  });
};
