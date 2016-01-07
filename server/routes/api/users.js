'use strict';

module.exports = function(app) {

  app.get('/api/users/current', function(req, res) {
    require('../../models/index.js')
    .then(function(models) {
      return models.useraccount.findOne({
        where: {
          id: req.user.id
        }
      });
    })
    .then(function(useraccount) {
      if (!useraccount) {
        throw new ReferenceError();
      }
      res.json({
        id: useraccount.id,
        email: useraccount.email,
        name: useraccount.name
      });
      return null;
    })
    .catch(ReferenceError, function() {
      res.status(401)
      .send('Authentication required');
    })
    .catch(function(error) {
      res.status(500)
      .send(error.message);
    })
  });

};

