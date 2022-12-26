'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserSchedule.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'User ID is required'},
        notEmpty: {msg: 'User ID is required'}
      }
    },
    ScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Schedule ID is required'},
        notEmpty: {msg: 'Schedule ID is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'UserSchedule',
  });
  return UserSchedule;
};