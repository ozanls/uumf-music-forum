const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CommentLike = sequelize.define(
    "CommentLike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      commentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "comments",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "commentlikes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["commentId", "userId"],
        },
      ],
    }
  );

  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    CommentLike.belongsTo(models.Comment, {
      foreignKey: "commentId",
      as: "comment",
    });
  };

  return CommentLike;
};
