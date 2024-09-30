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
  
  Board.associate = (models) => {
    Board.belongsToMany(models.Tag, {
      through: models.TrendingTag,
      foreignKey: 'boardId',
      otherKey: 'tagId'
    });
  };


  return Board;
};
