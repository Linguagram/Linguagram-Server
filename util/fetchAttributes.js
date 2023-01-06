"use strict";

const { Op } = require("sequelize");
const {
  Media,
  User,
  UserLanguage,
  Language,
  UserInterest,
  Interest,
} = require("../models");

const userFetchAttributes = () => {
  return {
    attributes: [
      "id",
      "username",
      "email",
      "country",
      "status",
      "phoneNumber",
      "verified",
      "AvatarId",
    ],
    include: [
      {
        model: Media,
        as: "Avatar",
      },
      {
        model: UserLanguage,
        include: [
          {
            model: Language,
          },
        ],
      },
      {
        model: UserInterest,
        include: [
          {
            model: Interest,
          },
        ],
      },
    ],
  };
}

const friendshipFetchAttributes = (userId) => {
  return {
    where: {
      [Op.or]: [
        {
          UserId: userId,
        },
        {
          FriendId: userId,
        },
      ],
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "Friend",
      },
    ],
  };
}

const oneFriendshipFetchAttributes = (userId, friendId) => {
  return {
    where: {
      [Op.or]: [
        {
          UserId: userId,
          FriendId: friendId,
        },
        {
          UserId: friendId,
          FriendId: userId,
        },
      ]
    },
    include: [
      {
        model: User,
        as: "User",
      },
      {
        model: User,
        as: "Friend",
      },
    ],
  };
}

module.exports = {
  userFetchAttributes,
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
}
