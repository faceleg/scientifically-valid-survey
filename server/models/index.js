'use strict';

var Promise         = require('bluebird');
var fs              = Promise.promisifyAll(require('fs'));
var path            = require('path');
var Sequelize       = require('sequelize');
var basename        = path.basename(module.filename);
var env             = process.env.NODE_ENV || 'development';
var sequelizeConfig = require(__dirname + '/../database.js')[env];
var db              = {};
var debugSql        = require('debug')('svs:sql');

var sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  port: sequelizeConfig.port,
  dialect: sequelizeConfig.dialect,
  logging: debugSql,
  dialectOptions: {
    multipleStatements: true
  }
});

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
      // force: true
    });
  })
  .then(function() {
    return resolve(db);
  });
});
