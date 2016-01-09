'use strict';

var path = require('path');
var Sequelize       = require('sequelize');
var env             = process.env.NODE_ENV || 'development';
var sequelizeConfig = require(path.join(__dirname, './database.js'))[env];
var debugSql        = require('debug')('svs:sql');

module.exports = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  port: sequelizeConfig.port,
  dialect: sequelizeConfig.dialect,
  logging: debugSql,
  dialectOptions: {
    multipleStatements: true,
    charset: 'utf8'
  }
});
