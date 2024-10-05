'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedTeamUUMFPassword = await bcrypt.hash('Hello12345%', 10);
    const hashedAdminPassword = await bcrypt.hash('Hello12345%', 10);
    const hashedUserPassword = await bcrypt.hash('Hello12345%', 10);

    await queryInterface.bulkInsert('users', [
      {
        username: 'teamuumf',
        role: 'admin',
        password: hashedTeamUUMFPassword,
        email: 'teamuumf@uumf.com',
        image: 'avatar.webp',
        bio: 'I am Team UUMF',
        confirmedEmail: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'admin',
        role: 'admin',
        password: hashedAdminPassword,
        email: 'admin@uumf.com',
        image: 'avatar.webp',
        bio: 'I am the admin',
        confirmedEmail: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user',
        role: 'user',
        password: hashedUserPassword,
        email: 'user@uumf.com',
        image: 'avatar.webp',
        bio: 'I am a user',
        confirmedEmail: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: ['teamuumf', 'admin', 'user'] }, {});
  } 
};