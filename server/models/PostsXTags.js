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
      model: 'posts', // Reference to posts table
      key: 'id',
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tags', // Reference to tags table
      key: 'id',
    },
  },
}, {
  tableName: 'posts_x_tags',
  timestamps: true
});

return PostXTag;
}