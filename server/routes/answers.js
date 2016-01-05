'use strict';
var debug = require('debug')('sys:/api/answers');

module.exports = function(app) {
  app.post('/api/answers', function(req, res) {
    if (!req.body.text) {
      return res.status(400).json('Answer must be provided');
    }

    if (!req.body.questionId) {
      return res.status(400).json('Question ID must be provided');
    }

    require('../models/index.js')
    .then(function(models) {
      models.answer.build({
        questionId: req.body.questionId,
        respondentId: req.respondent.id,
        text: req.body.text
      })
      .save();
    })
    .then(function(answer) {
      res.json(answer);
    });
  });
};
