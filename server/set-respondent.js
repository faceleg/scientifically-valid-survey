'use strict';

function createRespondentAndSetSession(req, res, next) {
  require('./models/index.js')
  .then(function(models) {
    return models.respondent.build()
    .save()
  })
  .then(function(respondent) {
    req.session.respondentId = respondent.id;
    next();
    return null;
  });
}

module.exports = function(req, res, next) {

  var respondentId = req.session.respondentId;
  if (!respondentId) {
    return createRespondentAndSetSession(req, res, next);
  }

  require('./models/index.js')
  .then(function(models) {
    return models.respondent.findOne({
      where: {
        id: req.session.respondentId
      }
    });
  })
  .then(function(respondent) {
    if (!respondent) {
      return createRespondentAndSetSession(res, req, next);
    }
    req.respondent = respondent;
    next();
    return null;
  });
};

