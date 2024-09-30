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
    hexCode: {
      type: DataTypes.STRING(7),
      allowNull: true,
      validate: {
        is: /^#[0-9A-F]{6}$/i
      }
    }
  }, {
    tableName: 'tags',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['boardId', 'name']
      }
    ]
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, {
      through: models.PostTag,
      foreignKey: 'tagId',
      otherKey: 'postId'
    });
  };

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Board, {
      through: models.TrendingTag,
      foreignKey: 'tagId',
      otherKey: 'boardId'
    });
  };

  return Tag;
};