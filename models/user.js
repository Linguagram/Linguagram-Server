'use strict';

const {
  Model
} = require('sequelize');

const {generateHash} = require('../helpers/bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Friendship, {
	 foreignKey: 'UserId'
      })
      User.hasMany(models.Friendship, {
	 foreignKey: 'FriendId'
      })
      User.hasMany(models.GroupMember, {
	 foreignKey: 'UserId'
      })
      User.hasMany(models.Message, {
	 foreignKey: 'UserId'
      })
      User.hasOne(models.Media, {
	 foreignKey: 'AvatarId',
	 as: "Avatar",
      })
      User.hasMany(models.UserLanguage, {
	 foreignKey: 'UserId'
      })
      User.hasMany(models.UserSchedule, {
	 foreignKey: 'UserId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	 notNull: {msg: 'Username is required'},
	 notEmpty: {msg: 'Username is required'}
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: 'Email has already been registered'},
      validate: {
	 notNull: {msg: 'Email is required'},
	 notEmpty: {msg: 'Email is required'},
	 isEmail: {msg: 'Invalid email format'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
	 notNull: {msg: 'Password is required'},
	 notEmpty: {msg: 'Password is required'},
	 len: {
	   args: [8],
	   msg: 'Password must have at least 8 characters'
	   }
      }
    },
    // Fredy: ini dibiarin gini kah? yang penting di create modelnya lah ya
    country: DataTypes.STRING,
    status: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    AvatarId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook('beforeCreate', (user, options) => {
    user.password = generateHash(user.password)
  });

  User.addHook('beforeUpdate', (user, options) => {
    if (user.password) user.password = generateHash(user.password)
  });

  return User;
};
