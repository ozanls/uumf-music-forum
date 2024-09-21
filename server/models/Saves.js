const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Save = sequelize.define('Save', {
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
    }
  }, {
    tableName: 'saves',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'user_id']
      }
    ]
  });

  return Save;
};