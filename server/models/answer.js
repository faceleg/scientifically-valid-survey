'use strict';
module.exports = function(sequelize) {
  return sequelize.define('answer', {}, {
    classMethods: {
      associate: function(models) {
        models.answer.belongsTo(models.choice);
      }
    }
  });
};
