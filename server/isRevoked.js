'use strict';

module.exports = function isRevoked(request, payload, done) {
  if (!payload) {
    return done(null, true);
  }

  require('./models/index.js')
  .then(function(models) {
    return models.token.findById(payload.tokenId);
  })
  .then(function(token) {
    if (!token) {
      return done(null, true);
    }
    done(null, token.isRevoked);
  });
};
