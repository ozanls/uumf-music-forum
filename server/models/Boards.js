const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Board = sequelize.define('Board', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'boards',
    timestamps: true
  });

  return Board;
};
