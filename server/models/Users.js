const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "active",
      },
      role: {
        type: DataTypes.ENUM("admin", "moderator", "vip", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      confirmedEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      agreedToTerms: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      receivePromo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Tag, {
      through: models.UserBadge,
      foreignKey: "userId",
      otherKey: "badgeId",
    });
  };

  User.associate = (models) => {
    User.belongsToMany(models.Post, {
      through: models.PostLike,
      foreignKey: "userId",
      otherKey: "postId",
    });
  };

  User.associate = (models) => {
    User.belongsToMany(models.Comment, {
      through: models.CommentLike,
      foreignKey: "userId",
      otherKey: "commentId",
    });
  };

  return User;
};
