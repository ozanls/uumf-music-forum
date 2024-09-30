module.exports = function(sequelize, DataTypes) {

    const PostTag = sequelize.define('PostTag', {
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
  tableName: 'PostTags',
  timestamps: true
});

PostTag.associate = (models) => {
  PostTag.belongsTo(models.Post, { foreignKey: 'postId', as: 'post' });
  PostTag.belongsTo(models.Tag, { foreignKey: 'tagId', as: 'tag' });
};

return PostTag;
}
