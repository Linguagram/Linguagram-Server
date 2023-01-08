"use strict";

const { Op } = require("sequelize");
const {
  Media,
  User,
  UserLanguage,
  Language,
  UserInterest,
  Interest,
  Group,
  GroupMember,
  sequelize,
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
        ...userFetchAttributes(),
        model: User,
        as: "User",
      },
      {
        ...userFetchAttributes(),
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
        ...userFetchAttributes(),
        model: User,
        as: "User",
      },
      {
        ...userFetchAttributes(),
        model: User,
        as: "Friend",
      },
    ],
  };
}

const groupFetchAttributes = (userId) => {
  const ret = {
    attributes: {
    },
    include: [
      {
        model: GroupMember,
        include: [
          {
            ...userFetchAttributes(),
            model: User,
          },
        ],
      },
    ],
  };

  if (userId) {
    ret.attributes.include = [
      [
        sequelize.literal(`(
SELECT COUNT(*)
FROM "Messages"
WHERE "Messages"."isRead" = FALSE
AND "Messages"."UserId" != ${userId}
AND "Messages"."GroupId" = "Group"."id"
)`),
        'unreadMessageCount'
      ],
    ];
  }

  return ret;
}

const messagesFetchAttributes = (groupId) => {
  const where = {
    GroupId: groupId,
  };

  return {
    where: groupId ? where : {},
    include: [
      {
        ...userFetchAttributes(),
        model: User,
      },
      Media,
      Group,
    ],
    order: [["createdAt", "DESC"]],
  }
}

module.exports = {
  userFetchAttributes,
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
  groupFetchAttributes,
  messagesFetchAttributes,
}
