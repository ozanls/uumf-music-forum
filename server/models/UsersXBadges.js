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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  badgeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'badges',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
}, {
  tableName: 'usersxbadges',
  timestamps: true
});

return UserXBadge;
}