const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'active'
    }
  }, {
    tableName: 'comments',
    timestamps: true,  // This will add createdAt and updatedAt fields
  });

  return Comment;
};
