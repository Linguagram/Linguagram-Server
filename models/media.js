'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Media.hasOne(models.User, {
        foreignKey: 'AvatarId',
	 as: "Avatar",
      })
      Media.hasOne(models.Message, {
        foreignKey: 'MediaId'
      })
    }
  }
  Media.init({
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'Name is required'},
        notEmpty: {msg: 'Name is required'}
      }
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {msg: 'URL is required'},
        notEmpty: {msg: 'URL is required'}
      }
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Format is required'},
        notEmpty: {msg: 'Format is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'Media',
  });
  return Media;
};
