'use strict';

var config = require('./config.js');
var express = require('express');
// var expressJwt = require('express-jwt');
var session = require('express-session');

var debug = require('debug')('svs');

var app = express();

app.use(require('connect-livereload')());

app.use(require('body-parser').json());
app.use(session({
  secret: 'correct horse battery staple',
  resave: false,
  saveUninitialized: true
}))

app.use(require('./set-respondent.js'))

// app.use('/api/admin', expressJwt({
//   secret: config.get('TOKEN_SECRET')
// }));

require('./routes/questions.js')(app);
require('./routes/answers.js')(app);

app.use(express.static('public'));

app.use(unauthorisedErrorHandler);
app.use(catchAllErrorHandler);

process.on('uncaughtException', function(error) {
  /* eslint-disable no-console, no-process-exit, lines-around-comment */
  console.error('uncaughtException:', error.message);
  console.error(error.stack);
  process.exit(1);
  /* eslint-enable no-console, no-process-exit, lines-around-comment */
});

debug('Starting server on port %s', config.get('PORT'));
return require('http')
.createServer(app)
.listen(config.get('PORT'));

function unauthorisedErrorHandler(error, req, res, next) {
  if (error.name !== 'UnauthorizedError') {
    return next(error);
  }

  debug(error);
  res.status(401);
  res.json({
    message: error.message
  });
}

function catchAllErrorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  var code = 500;
  if (error.code) {
    code = error.code;
  }

  debug(error);
  res.status(code);
  res.json({
    message: error.message
  });
}
