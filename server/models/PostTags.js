"use strict";

module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define(
    "PostTag",
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
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tags",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "posttags",
      timestamps: true,
    }
  );

  PostTag.associate = (models) => {
    PostTag.belongsTo(models.Post, {
      foreignKey: "postId",
      as: "post",
    });
    PostTag.belongsTo(models.Tag, {
      foreignKey: "tagId",
      as: "tag",
    });
  };

  return PostTag;
};
