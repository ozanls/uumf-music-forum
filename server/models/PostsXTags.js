module.exports = function(sequelize, DataTypes) {

    const PostXTag = sequelize.define('PostXTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'posts',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
}, {
  tableName: 'postsxtags',
  timestamps: true
});

return PostXTag;
}
