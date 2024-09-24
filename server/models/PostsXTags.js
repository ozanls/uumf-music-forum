module.exports = function(sequelize, DataTypes) {

    const PostXTag = sequelize.define('PostXTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts', 
      key: 'id',
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id',
    },
  },
}, {
  tableName: 'postsxtags',
  timestamps: true
});

return PostXTag;
}