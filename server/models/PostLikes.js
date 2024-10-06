const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PostLike = sequelize.define(
    "PostLike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "postlikes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["postId", "userId"],
        },
      ],
    }
  );

  return PostLike;
};
