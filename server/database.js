'use strict';

var config = require('./config.js');

var configuration = {
  dialect: 'mysql',
  url: config.get('MYSQL_CONNECTION')
};

module.exports = {
  production: configuration,
  development: configuration
}
