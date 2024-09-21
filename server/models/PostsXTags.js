module.exports = function(sequelize, DataTypes) {

    const PostsXTags = sequelize.define('PostsXTags', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts', // Reference to posts table
      key: 'id',
    },
  },
  tag_id: {
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

return PostsXTags;
}