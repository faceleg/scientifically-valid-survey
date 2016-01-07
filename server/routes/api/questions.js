'use strict';

module.exports = function(app) {

  app.get('/api/questions', function(req, res) {
    require('../../models/index.js')
    .then(function(models) {
      var params = {
        include: [
          models.choice
        ]
      };
      params.order = [req.query.orderBy];
      params.offset = req.query.offset;
      params.limit = req.query.limit;
      return models.question.findAll(params);
    })
    .then(function(questions) {
      questions = questions || [];
      res.json(questions);
    });
  });

  app.put('/api/questions/:id', function(req, res) {
    if (!req.body.text) {
      return res.status(400).json('Answer must be provided');
    }

    require('../../models/index.js')
    .then(function(models) {
      var params
      return models.question.findOne({
        where: {
          id: req.body.id
        }
      });
    })
    .then(function(question) {
      if (!question) {
        throw new ReferenceError();
      }
      question.text = req.body.text;
      return question.save();
    })
    .then(function(question) {
      res.json(question);
    })
    .catch(ReferenceError, function() {
      res.status(404)
      .send('Question does not exist');
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  })

  app.post('/api/questions', function(req, res) {
    if (!req.body.text) {
      return res.status(400).json('Answer must be provided');
    }

    require('../../models/index.js')
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

  app.delete('/api/questions/:id', function(req, res) {
    require('../../models/index.js')
    .then(function(models) {
      return models.question.findOne({
        where: {
          id: req.params.id
        }
      })
    })
    .then(function(question) {
      if (!question) {
        throw new ReferenceError();
      }
      return question.destroy({
        cascade: true
      });
    })
    .then(function() {
      res.status(204).send();;
    })
    .catch(ReferenceError, function() {
      res.status(404)
      .send('Question does not exist');
    })
    .catch(function(error) {
      res.status(400)
      .send(error.message);
    })
  })
};
