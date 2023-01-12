'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserInterest.belongsTo(models.User, {
        foreignKey: "UserId",
      });
      UserInterest.belongsTo(models.Interest, {
        foreignKey: "InterestId",
      });
    }
  }
  UserInterest.init({
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    InterestId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Interests",
        key: "id",
      },
    },
  }, {
    sequelize,
    modelName: 'UserInterest',
  });
  return UserInterest;
};
