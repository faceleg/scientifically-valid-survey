'use strict';

var Promise         = require('bluebird');
var fs              = Promise.promisifyAll(require('fs'));
var path            = require('path');
var basename        = path.basename(module.filename);
var db              = {};

var sequelize = require('../sequelize.js');

module.exports = new Promise(function(resolve) {
  fs
  .readdirAsync(__dirname)
  .then(function(files) {
    files.filter(function(file) {
      if (file === basename) {
        return false;
      }

      if (file.slice(-3) === '.js') {
        return true;
      }
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });
  })
  .then(function() {
    Object.keys(db).forEach(function(modelName) {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    db.Sequelize = require('Sequelize');

    return db.sequelize.sync({
      // force: true
    });
  })
  .then(function() {
    return resolve(db);
  });
});
