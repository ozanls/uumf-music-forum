const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const TrendingTag = sequelize.define(
    "TrendingTag",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "boards",
          key: "id",
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tags",
          key: "id",
        },
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "TrendingTags",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["boardId", "tagId"],
        },
      ],
    }
  );

  TrendingTag.associate = (models) => {
    TrendingTag.belongsTo(models.Board, {
      foreignKey: "boardId",
      as: "board",
    });

    TrendingTag.belongsTo(models.Tag, {
      foreignKey: "tagId",
      as: "tag",
    });
  };

  return TrendingTag;
};
