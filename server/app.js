'use strict';

var config = require('./config.js');
var express = require('express');
var expressJwt = require('express-jwt');
var session = require('express-session');
var debug = require('debug')('svs:app');

var app = express();

app.use(require('body-parser').json());
app.use(session({
  secret: 'correct horse battery staple',
  resave: false,
  saveUninitialized: true
}))

app.use(require('./set-respondent.js'))

var isRevoked = require('./isRevoked.js');
app.use('/api', expressJwt({
  secret: config.get('TOKEN_SECRET'),
  isRevoked: isRevoked
}));

app.use(express.static('public'));

app.use(require('connect-livereload')());

require('./routes/authentication/login.js')(app);
require('./routes/authentication/logout.js')(app);

require('./routes/public-api/questions.js')(app);
require('./routes/public-api/answers.js')(app);

require('./routes/api/users.js')(app);
require('./routes/api/questions.js')(app);
require('./routes/api/answers.js')(app);
require('./routes/api/choices.js')(app);

var path = require('path');
app.route('/*') // this is the last route
.get(function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use(unauthorisedErrorHandler);
app.use(catchAllErrorHandler);

module.exports = app;

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
