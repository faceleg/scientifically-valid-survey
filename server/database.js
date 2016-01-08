'use strict';

var config = require('./config.js');

var configuration = {
  dialect: 'mysql',
  host: config.get('RDS_HOSTNAME'),
  port: config.get('RDS_PORT'),
  username: config.get('RDS_USERNAME'),
  password: config.get('RDS_PASSWORD'),
  database: config.get('RDS_DB_NAME')
};

module.exports = {
  production: configuration,
  development: configuration
}
