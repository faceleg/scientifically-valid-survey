'use strict';

var config = require('../../config.js');
var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/logout');

module.exports = function(app) {
  require('../../models/index.js')
  .then(function(models) {
    app.post('/authentication/logout', function(req, res, next) {
      jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.get('TOKEN_SECRET'), function(error, jwtToken) {
        if (error) {
          return handleError(error, res, next);
        }

        models.token.findById(jwtToken.tokenId)
        .then(function(token) {
          if (!token) {
            debug('Logout called with a token not represented in DB');
            return res.sendStatus(201);
          }
          token.isRevoked = true;
          token.save()
          .then(function() {
            res.sendStatus(201);
            return null;
          });
          return null;
        });
      });
    });
    return null;
  });
};

function handleError(error, res, next) {
  if (error.name === 'JsonWebTokenError') {
    debug('Logout called with an invalid JWT token');
    return res.sendStatus(201);
  }
  next(error);
}
