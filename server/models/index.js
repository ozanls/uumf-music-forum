'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// PostTag Associations
db.Post.belongsToMany(db.Tag, {
  through: 'PostTags',
  foreignKey: 'postId',
  otherKey: 'tagId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Tag.belongsToMany(db.Post, {
  through: 'PostTags',
  foreignKey: 'tagId',
  otherKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// UserBadges Associations
db.User.belongsToMany(db.Badge, {
  through: 'UserBadges',
  foreignKey: 'userId',
  otherKey: 'badgeId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Badge.belongsToMany(db.User, {
  through: 'UserBadges',
  foreignKey: 'badgeId',
  otherKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// TrendingTags Associations
db.Board.belongsToMany(db.Tag, {
  through: 'TrendingTags',
  foreignKey: 'boardId',
  otherKey: 'tagId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Tag.belongsToMany(db.Board, {
  through: 'TrendingTags',
  foreignKey: 'tagId',
  otherKey: 'boardId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// PostLikes Associations
db.User.hasMany(db.PostLike, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Post.hasMany(db.PostLike, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// CommentLikes Associations
db.User.hasMany(db.CommentLike, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Comment.hasMany(db.CommentLike, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// Saves Associations
db.User.hasMany(db.Save, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Post.hasMany(db.Save, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
