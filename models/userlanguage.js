'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLanguage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserLanguage.belongsTo(models.User, {
        foreignKey: 'UserId'
      })
      UserLanguage.belongsTo(models.Language, {
        foreignKey: 'LanguageId'
      })
    }
  }
  UserLanguage.init({
    type: DataTypes.STRING,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'User ID is required'},
        notEmpty: {msg: 'User ID is required'}
      }
    },
    LanguageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Language ID is required'},
        notEmpty: {msg: 'Language ID is required'}
      }
    },
  }, {
    sequelize,
    modelName: 'UserLanguage',
  });
  return UserLanguage;
};