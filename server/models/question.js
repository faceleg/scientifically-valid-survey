'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('question', {
    text: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        models.question.hasMany(models.answer);
        models.question.hasMany(models.choice);
      }
    }
  });
};
