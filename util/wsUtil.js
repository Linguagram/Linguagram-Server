"use strict";

const {
  User,
  Media,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");

const getUserWs = async (userId) => {
  const user = await User.findByPk(userId, userFetchAttributes(Media));

  if (!user) throw {
    error: true,
    message: "Unknown user",
  };

  return user;
}

module.exports = {
  getUserWs,
}
