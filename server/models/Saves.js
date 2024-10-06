const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Save = sequelize.define(
    "Save",
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
      tableName: "saves",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["postId", "userId"],
        },
      ],
    }
  );

  Save.associate = (models) => {
    Save.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
    Save.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Save;
};
