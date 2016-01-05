'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('answer', {
    text: DataTypes.TEXT,
    respondentId: DataTypes.INTEGER,
    questionId: DataTypes.INTEGER
  });
};
