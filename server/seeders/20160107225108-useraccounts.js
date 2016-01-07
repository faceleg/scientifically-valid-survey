'use strict';

module.exports = {
  up: function (queryInterface) {
    return queryInterface.sequelize.query(
      'INSERT INTO `svs`.`useraccounts` ' +
      '(name, email, password, status, updatedWithToken, createdAt, updatedAt) ' +
      'VALUES ("Dr. Doooom", "drdoom@svs.com", "$2a$10$s7BtT0EJ3NCcKWTUKEA68.dGFa3lVu8SotoXYRbmeIDD39bJ24Xra", "Active", "-1", NOW(), NOW());');
    // return queryInterface.sequelize.bulkInsert('useraccounts', [
    //   {
    //     name: 'Dr. Doooom',
    //     email: 'drdoooom@svs.com',
    //     password: '$2a$10$s7BtT0EJ3NCcKWTUKEA68.dGFa3lVu8SotoXYRbmeIDD39bJ24Xra',
    //     status: 'Active',
    //     upatedWithToken: -1,
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    //   }
    // ], {});
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.query('DELETE FROM useraccounts;');
  }
};
