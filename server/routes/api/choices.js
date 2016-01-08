'use strict';

module.exports = function(app) {

  app.put('/api/choices/:id', function(req, res) {
    if (!req.body.text) {
      return res.status(400).send('Choice text must be provided');
    }

    if (!req.body.questionId) {
      return res.status(400).send('Question ID must be provided');
    }

    require('../../models/index.js')
    .then(function(models) {
      return models.choice.findOne({
        where: {
          id: req.params.id
        }
      })
    })
    .then(function(choice) {
      if (!choice) {
        throw new ReferenceError();
      }
      choice.questionId = req.body.questionId;
      choice.text = req.body.text;
      return choice.save();
    })
    .then(function(choice) {
      res.json(choice);
      return null;
    })
    .catch(ReferenceError, function() {
      res.status(404)
      .send('Choice does not exist');
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  });

  app.delete('/api/choices/:id', function(req, res) {
    require('../../models/index.js')
    .then(function(models) {
      return models.choice.findOne({
        where: {
          id: req.params.id
        }
      })
    })
    .then(function(choice) {
      if (!choice) {
        throw new ReferenceError();
      }
      return choice.destroy();
    })
    .then(function() {
      res.status(204).send();
      return null;
    })
    .catch(ReferenceError, function() {
      res.status(404)
      .send('Choice does not exist');
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  });

  app.post('/api/choices', function(req, res) {
    if (!req.body.text) {
      return res.status(400).send('Choice text must be provided');
    }

    if (!req.body.questionId) {
      return res.status(400).send('Question ID must be provided');
    }

    require('../../models/index.js')
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
      res.status(500)
      .send(error.message);
    })
  });
};
