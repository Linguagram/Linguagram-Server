'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.hasMany(models.UserSchedule, {
        foreignKey: 'ScheduleId'
      })
    }
  }
  Schedule.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Name is required'},
        notEmpty: {msg: 'Name is required'}
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'Description is required'},
        notEmpty: {msg: 'Description is required'}
      }
    },
    scheduleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {msg: 'Date is required'},
        notEmpty: {msg: 'Date is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};