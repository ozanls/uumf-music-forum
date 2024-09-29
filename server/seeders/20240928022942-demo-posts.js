'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('posts', [
      {
        boardId: 1,
        userId: 1,
        title: 'Example post',
        body: 'This is an example post body.',
        likes: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', { title: 'Example post' }, {});
  }
};