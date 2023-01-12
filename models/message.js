'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.Group, {
        foreignKey: 'GroupId'
      })
      Message.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      Message.belongsTo(models.Media, {
        foreignKey: 'MediaId'
      })
    }
  }
  Message.init({
    content: DataTypes.TEXT,
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    MediaId: DataTypes.INTEGER,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'User ID is required'},
        notEmpty: {msg: 'User ID is required'}
      }
    },
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Group ID is required'},
        notEmpty: {msg: 'Group ID is required'}
      },
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
