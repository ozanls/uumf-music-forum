module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define(
    "Post",
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "active",
      },
    },
    {
      tableName: "posts",
      timestamps: true,
    }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Post.belongsTo(models.Board, {
      foreignKey: "boardId",
      as: "board",
    });

    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "postComment",
    });

    Post.hasMany(models.PostLike, {
      foreignKey: "postId",
      as: "postLike",
    });

    Post.hasMany(models.Save, {
      foreignKey: "postId",
      as: "postSave",
    });

    Post.hasMany(models.PostTag, {
      foreignKey: "postId",
      as: "postTag",
    });
  };

  return Post;
};
