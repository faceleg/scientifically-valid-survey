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
  RDS_PORT: {
    doc: 'The database port.',
    format: Number,
    default: null,
    env: 'RDS_PORT'
  },
  RDS_USERNAME: {
    default: null,
    format: String,
    doc: 'The database username.',
    env: 'RDS_USERNAME'
  },
  RDS_PASSWORD: {
    default: '',
    format: String,
    doc: 'The database password.',
    env: 'RDS_PASSWORD'
  },
  RDS_HOSTNAME: {
    default: null,
    format: String,
    doc: 'The database hostname.',
    env: 'RDS_HOSTNAME'
  },
  RDS_DB_NAME: {
    default: null,
    format: String,
    doc: 'The database name.',
    env: 'RDS_DB_NAME'
  }
});

config.validate({
  strict: true
});

module.exports = config;

