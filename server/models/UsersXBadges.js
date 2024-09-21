module.exports = function(sequelize, DataTypes) {

  const UserXBadge= sequelize.define('UserXBadge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Reference to users table
      key: 'id',
    },
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges', // Reference to badges table
      key: 'id',
    },
  },
}, {
  tableName: 'users_x_badges',
  timestamps: true
});

return UserXBadge;
}