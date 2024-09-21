module.exports = function(sequelize, DataTypes) {

  const UsersXBadges= sequelize.define('UsersXBadges', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // Reference to users table
      key: 'id',
    },
  },
  badge_id: {
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

return UsersXBadges;
}