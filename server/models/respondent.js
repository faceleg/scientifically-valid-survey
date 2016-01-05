'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respondent', {
    cookie: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.respondent.hasMany(models.answer);
      }
    }
  });
};
