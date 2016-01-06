'use strict';
var debug = require('debug')('sys:/api/answers');

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
      models.answer.build({
        questionId: req.body.questionId,
        respondentId: req.respondent.id,
        choiceId: req.body.choiceId
      })
      .save();
    })
    .then(function(answer) {
      res.json(answer);
    })
    .catch(function(error) {
      res.status(400).send(error.message);
    });
  });
};
