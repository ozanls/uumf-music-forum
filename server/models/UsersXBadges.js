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
      model: 'users',
      key: 'id',
    },
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id',
    },
  },
}, {
  tableName: 'usersxbadges',
  timestamps: true
});

return UserXBadge;
}