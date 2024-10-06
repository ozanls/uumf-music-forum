"use strict";

const getRandomColor = require("../utilities/GetRandomColor");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "tags",
      [
        {
          name: "Kendrick Lamar",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "discography",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "discussion",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "battle rap",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "underground",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "new talent",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "J Dilla",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "production",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "influence",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "storytelling",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "lyricism",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "2020s",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "drill",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "global hip-hop",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "subgenres",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "female MCs",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "underrated",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "2010s",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "streaming",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "music industry",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "crossover",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "digital age",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "social issues",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "activism",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "impact",
          boardId: 1,
          hexCode: getRandomColor(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tags", null, {});
  },
};
