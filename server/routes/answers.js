'use strict';

module.exports = function(app) {
  app.post('/api/answers', function(req, res) {
    if (!req.body.questionId) {
      return res.status(400).send('Question ID must be provided');
    }

    if (!req.body.choiceId) {
      return res.status(400).send('Choice ID must be provided');
    }

    require('../models/index.js')
    .then(function(models) {
      return models.answer.build({
        questionId: req.body.questionId,
        respondentId: req.respondent.id,
        choiceId: req.body.choiceId
      })
      .save();
    })
    .then(function(answer) {
      res.json(answer);
      return null;
    })
    .catch(function(error) {
      res.status(400).send(error.message);
    });
  });

  app.get('/api/answers', function(req, res) {
    var models;
    require('../models/index.js')
    .then(function(_models_) {
      models = _models_;
      return models.sequelize.query([
        'SELECT c.id AS choiceId, ',
        'c.text AS choiceText, ',
        'SUM(c.id) AS totalChosen ',

        'FROM answers AS a ',

        'LEFT JOIN questions AS q ',
        'ON q.id = a.questionId ',

        'LEFT JOIN choices AS c ',
        'ON c.id = a.choiceId ',

        'WHERE q.id = $questionId ',

        'GROUP BY c.id '
      ].join(''), {
        type: models.Sequelize.QueryTypes.SELECT,
        bind: {
          questionId: req.query.questionId
        }
      })
    })
    .then(function(answers) {
        res.json(answers);
      })
      .catch(function(error) {
        res.status(400).send(error.message);
      });
  });
};
