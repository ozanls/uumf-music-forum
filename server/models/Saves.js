const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Save = sequelize.define('Save', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'saves',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['postId', 'userId']
      }
    ]
  });

  return Save;
};