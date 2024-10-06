"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "posttags",
      [
        {
          postId: 1,
          tagId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 1,
          tagId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 1,
          tagId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 2,
          tagId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 2,
          tagId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 2,
          tagId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 3,
          tagId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 3,
          tagId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 3,
          tagId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 4,
          tagId: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 4,
          tagId: 11,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 4,
          tagId: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 5,
          tagId: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 5,
          tagId: 14,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 5,
          tagId: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 6,
          tagId: 16,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 6,
          tagId: 17,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 6,
          tagId: 18,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 7,
          tagId: 19,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 7,
          tagId: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 7,
          tagId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 8,
          tagId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 8,
          tagId: 21,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 8,
          tagId: 9,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 9,
          tagId: 22,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 9,
          tagId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 9,
          tagId: 23,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 10,
          tagId: 24,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 10,
          tagId: 25,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          postId: 10,
          tagId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("posttags", null, {});
  },
};
