'use strict';

var convict = require('convict');

var config = convict({
  NODE_ENV: {
    doc: 'The applicaton environment.',
    format: [
      'production',
      'development',
      'test'
    ],
    default: 'development',
    env: 'NODE_ENV'
  },
  PORT: {
    doc: 'The port to bind.',
    format: Number,
    default: null,
    env: 'PORT'
  },
  TOKEN_SECRET: {
    doc: 'The JWT token secret.',
    format: String,
    default: null,
    env: 'TOKEN_SECRET'
  },
  MYSQL_CONNECTION: {
    doc: 'The MySQL connection string',
    format: String,
    default: null,
    env: 'MYSQL_CONNECTION'
  }
});

config.validate({
  strict: true
});

module.exports = config;

