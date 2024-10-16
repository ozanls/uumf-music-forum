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
        type: DataTypes.ENUM("admin", "moderator", "vip", "user", "banned"),
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
    User.hasMany(models.Post, {
      foreignKey: "userId",
      as: "post",
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      as: "comment",
    });
    User.hasMany(models.CommentLike, {
      foreignKey: "userId",
      as: "commentLike",
    });
    User.hasMany(models.PostLike, {
      foreignKey: "userId",
      as: "postLike",
    });
    User.hasMany(models.Save, {
      foreignKey: "userId",
      as: "save",
    });
    User.hasMany(models.Badge, {
      foreignKey: "userId",
      as: "badge",
    });
    User.hasMany(models.UserBadge, {
      foreignKey: "userId",
      as: "userBadge",
    });
  };

  return User;
};
