"use strict";

const { Op } = require("sequelize");

const userFetchAttributes = (Media) => {
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
    ],
  }
}

const friendshipFetchAttributes = (userId, User) => {
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
    }
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
    }
}

module.exports = {
  userFetchAttributes,
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
}
