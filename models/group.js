'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.GroupMember, {
        foreignKey: 'GroupId'
      })
      Group.hasMany(models.Message, {
        foreignKey: 'GroupId'
      })
    }
  }
  Group.init({
    name: {
      type: DataTypes.STRING,
      validate: {        
      },
    },
    description:{
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: "dm",
      validate: {
        
      },
    },
  }, {
      sequelize,
      modelName: 'Group',
    });
  return Group;
};
