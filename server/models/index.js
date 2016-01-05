'use strict';

var Promise = require('bluebird');
var fs        = Promise.promisifyAll(require('fs'));
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../database.js')[env];
var db        = {};

var sequelize = new Sequelize(config.url);

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
    db.Sequelize = Sequelize;

    return db.sequelize.sync({
      force: true
    });
  })
  .then(function() {
    return fs.readFileAsync(path.resolve(__dirname, '../../data/questions.sql'), 'utf-8');
  })
  .then(function(file) {
    return db.sequelize.query(file);
  })
  .then(function() {
    return resolve(db);
  });
});
