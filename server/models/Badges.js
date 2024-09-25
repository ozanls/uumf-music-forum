const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Badge = sequelize.define('Badge', {
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
    tableName: 'badges',
    timestamps: true
  });

  Badge.associate = (models) => {
    Badge.belongsToMany(models.Tag, {
      through: models.UserXBadge,
      foreignKey: 'badgeId',
      otherKey: 'userId'
    });
  };


  return Badge;
};