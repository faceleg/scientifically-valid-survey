'use strict';

module.exports = function(app) {

  app.get('/public-api/questions/random', function(req, res) {
    var models;
    require('../../models/index.js')
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

      // This is a dumb hack, look away
      return question[0].reload({
        include: [
          models.choice,
        ]
      })
      .then(function(_question_) {
        res.json(_question_);
      })
      .catch(function(error) {
        res.status(400).send(error.message);
      });
    });
  });
};
