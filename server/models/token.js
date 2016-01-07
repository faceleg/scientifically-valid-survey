'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('token', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresOn: {
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.ENUM(['Login', 'Reset Password']), // eslint-disable-line new-cap
      allowNull: false
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    payload: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedWithToken: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};

