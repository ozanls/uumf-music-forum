const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'boards',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    hex_code: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i  // Validates that it's a proper hex color code
      }
    }
  }, {
    tableName: 'tags',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['boardId', 'name']  // Ensures tag names are unique within a board
      }
    ]
  });

  return Tag;
};