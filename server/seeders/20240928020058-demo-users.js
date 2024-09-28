'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedAdminPassword = await bcrypt.hash('hello123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        role: 'admin',
        password: hashedAdminPassword,
        email: 'admin@uumf.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        role: 'user',
        password: hashedUserPassword,
        email: 'user@uumf.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: ['admin', 'user'] }, {});
  } 
};