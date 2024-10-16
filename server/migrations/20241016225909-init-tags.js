"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tags", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "boards",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      hexCode: {
        type: Sequelize.STRING(7),
        allowNull: true,
        validate: {
          is: /^#[0-9A-F]{6}$/i,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex("tags", ["boardId", "name"], {
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("tags");
  },
};
