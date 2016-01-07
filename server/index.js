'use strict';

var config = require('./config.js');
var debug = require('debug')('svs:index');

process.on('uncaughtException', function(error) {
  /* eslint-disable no-console, no-process-exit, lines-around-comment, angular/log */
  console.error('uncaughtException:', error.message);
  console.error(error.stack);
  process.exit(1);
  /* eslint-enable no-console, no-process-exit, lines-around-comment */
});

debug('Starting server on port %s', config.get('PORT'));

require('http')
.createServer(require('./app.js'))
.listen(config.get('PORT'));

