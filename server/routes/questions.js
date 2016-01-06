'use strict';

module.exports = function(app) {

  app.get('/api/questions', function(req, res) {
    require('../models/index.js')
    .then(function(models) {
      return models.question.findAll();
    })
    .then(function(questions) {
      questions = questions || [];
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
      })
      .then(function(_question_) {
        res.json(_question_);
      });
    });
  });

  app.post('/api/questions', function(req, res) {
    if (!req.body.text) {
      return res.status(400).json('Answer must be provided');
    }

    require('../models/index.js')
    .then(function(models) {
      return models.question.build({
        text: req.body.text
      })
      .save();
    })
    .then(function(question) {
      res.json(question);
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  })

  app.del('/api/questions/:id', function(req, res) {
    require('../models/index.js')
    .then(function(models) {
      return models.question.findOne({
        where: {
          id: req.params.id
        }
      })
    })
    .then(function(question) {
      return question.destroy();
    })
    .then(function() {
      res.status(204);
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  })
};
