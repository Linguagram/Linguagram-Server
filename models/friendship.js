'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friendship.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      Friendship.belongsTo(models.User, {
        foreignKey: 'FriendId'
      })
    }
  }
  Friendship.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'User ID is required'},
        notEmpty: {msg: 'User ID is required'}
      }
    },
    FriendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Friend ID is required'},
        notEmpty: {msg: 'Friend ID is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'Friendship',
  });
  return Friendship;
};