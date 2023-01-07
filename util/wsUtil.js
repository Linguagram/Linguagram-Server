"use strict";

const {
  User,
  Media,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");

const getUserWs = async (userId) => {
  return User.findByPk(userId, userFetchAttributes(Media));
}

module.exports = {
  getUserWs,
}
