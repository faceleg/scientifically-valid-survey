'use strict';

var InvalidLoginDetailsError = function InvalidLoginDetailsError() {
  this.message = 'Invalid email or password';
  this.name = 'InvalidLoginDetailsError';
  this.code = 401;
  Error.captureStackTrace(this, InvalidLoginDetailsError);
};
InvalidLoginDetailsError.prototype = Object.create(Error.prototype);
InvalidLoginDetailsError.prototype.constructor = InvalidLoginDetailsError;

module.exports = InvalidLoginDetailsError;

