'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('choice', {
    text: DataTypes.TEXT
  });
};
