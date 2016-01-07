'use strict';

var TooManyLoginAttemptsError = function TooManyLoginAttemptsError() {
  this.message = 'Too many login attempts, please try again later';
  this.name = 'TooManyLoginAttemptsError';
  this.code = 429;
  Error.captureStackTrace(this, TooManyLoginAttemptsError);
};
TooManyLoginAttemptsError.prototype = Object.create(Error.prototype);
TooManyLoginAttemptsError.prototype.constructor = TooManyLoginAttemptsError;

module.exports = TooManyLoginAttemptsError;

