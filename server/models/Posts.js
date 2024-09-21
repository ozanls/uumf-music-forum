module.exports = function(sequelize, DataTypes) {

    const Post = sequelize.define('Post', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        boardId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'boards',
            key: 'id'
          }
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        title: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        body: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        likes: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        status: {
          type: DataTypes.STRING(20),
          defaultValue: 'active'
        }
      }, {
        tableName: 'posts',
        timestamps: true
      });
    
      return Post;
 
}