'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupMember.belongsTo(models.Group, {
        foreignKey: 'GroupId'
      })
      GroupMember.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
    }
  }
  GroupMember.init({
    GroupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Group ID is required'},
        notEmpty: {msg: 'Group ID is required'}
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'User ID is required'},
        notEmpty: {msg: 'User ID is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'GroupMember',
  });
  return GroupMember;
};