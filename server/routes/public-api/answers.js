'use strict';

module.exports = function(app) {
  app.post('/public-api/answers', function(req, res) {
    if (!req.body.questionId) {
      return res.status(400).send('Question ID must be provided');
    }

    if (!req.body.choiceId) {
      return res.status(400).send('Choice ID must be provided');
    }

    require('../../models/index.js')
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

};
