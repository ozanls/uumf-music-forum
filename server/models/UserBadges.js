module.exports = function (sequelize, DataTypes) {
  const UserBadge = sequelize.define(
    "UserBadge",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      badgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "badges",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      tableName: "userbadges",
      timestamps: true,
    }
  );

  UserBadge.associate = (models) => {
    UserBadge.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    UserBadge.belongsTo(models.Badge, { foreignKey: "badgeId", as: "badge" });
  };

  return UserBadge;
};
