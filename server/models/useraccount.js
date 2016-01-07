'use strict';

var R = require('ramda');

module.exports = function(sequelize, DataTypes) {
  var loginMethods = require('./useraccount/methods/login.js');

  var useraccount = sequelize.define('useraccount', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Name may not be blank'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM(R.values(require('./enum/statuses.js'))) // eslint-disable-line new-cap
    },
    lockUntil: {
      type: DataTypes.DATE
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    updatedWithToken: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    instanceMethods: {
      isLocked: function() {
        return loginMethods.isLocked(this);
      },
      incrementLoginAttempts: function() {
        return loginMethods.incrementLoginAttempts(this);
      }
    },
    classMethods: {
      login: function(email, password) {
        return loginMethods.login(useraccount)(email, password);
      },
      TooManyAttemptsError: loginMethods.TooManyAttemptsError,
      InvalidLoginDetailsError: loginMethods.InvalidLoginDetailsError
    }
  });

  require('./useraccount/hooks/hashPassword.js')(useraccount);

  return useraccount;
};

