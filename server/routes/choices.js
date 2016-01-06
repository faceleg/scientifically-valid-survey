'use strict';

module.exports = function(app) {
  app.post('/api/choices', function(req, res) {
    if (!req.body.text) {
      return res.status(400).json('Choice text must be provided');
    }

    if (!req.body.questionId) {
      return res.status(400).json('Question ID must be provided');
    }

    require('../models/index.js')
    .then(function(models) {
      return models.choice.build({
        questionId: req.body.questionId,
        text: req.body.text
      })
      .save();
    })
    .then(function(choice) {
      res.json(choice);
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  });
};
