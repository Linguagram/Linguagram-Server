"use strict";

const { Op } = require("sequelize");
const {
  Media,
  User,
  Message,
  GroupMember,
  Group,
  sequelize,
} = require("../models");

const { userFetchAttributes } = require("./fetchAttributes");

const handleUploaded = require("./handleUploaded");
const { validateUserId } = require("./validators");
const { isOnline } = require("./ws");

const getGroupMembers = async (groupId, req) => {
  const groupMembers = await GroupMember.findAll({
    where: {
      GroupId: groupId,
    },
    include: [
      Group,
      {
        ...userFetchAttributes(),
        model: User,
      },
    ],
  });

  // check if user is actually in the group
  if (!groupMembers.some(member => member.UserId === req.userInfo.id)) {
    throw {
      status: 404,
      message: "Unknown Group",
    };
  }

  for (const gm of groupMembers) {
    gm.User.dataValues.isOnline = isOnline(gm.UserId);
  }

  return groupMembers;
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

const getGroupMembersFromUserId = async (userId) => {
  const groupMembers = await GroupMember.findAll({
    where: {
      UserId: userId,
    },
    include: [
      {
        ...groupFetchAttributes(userId),
        model: Group,
      },
      {
        ...userFetchAttributes(),
        model: User,
      },
    ],
  });

  for (const gm of groupMembers) {
    gm.User.dataValues.isOnline = isOnline(gm.UserId);

    for (const gm2 of gm.Group.GroupMembers) {
      gm2.User.dataValues.isOnline = isOnline(gm2.UserId);
    }
  }

  return groupMembers;
}

const getMessages = async (groupId) => {
  const messages = await Message.findAll({
    where: {
      GroupId: groupId,
    },
    include: [
      {
        ...userFetchAttributes(),
        model: User,
      },
      Media,
      Group,
    ],
    order: [["createdAt", "DESC"]],
  });

  return messages.map(message => {
    message.dataValues.edited = message.createdAt !== message.updatedAt;
    message.User.dataValues.isOnline = isOnline(message.UserId);

    return message;
  });
}

const getMessage = async (messageId, groupId) => {
  const message = await Message.findByPk(messageId, {
    where: {
      GroupId: groupId,
    },
    include: [
      {
        ...userFetchAttributes(),
        model: User,
      },
      Media,
      Group,
    ],
  });

  if (!message) {
    throw {
      status: 404,
      message: "Unknown message",
    };
  }

  message.dataValues.edited = message.createdAt !== message.updatedAt;

  message.User.dataValues.isOnline = isOnline(message.UserId);

  return message;
}

const fileAction = async (req) => {
  // handle uploaded attachment if any
  if (req.file) {
    return handleUploaded(req.file);
  }
}

const getUser = async (userId) => {
  const user = await User.findByPk(userId, userFetchAttributes(Media));
  if(!user){
    throw {
      status : 404,
      message : "Unknown user"
    }
  }
  user.dataValues.isOnline = isOnline(user.id);

  return user;
}

const getGroup = async (groupId) => {
  const group = await Group.findByPk(groupId, {
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
    ]
  });

  if (!group) throw {
    status: 404,
    message: "Group not found",
  };

  return group;
}

const getDmGroup = async (user, friend) => {
  const userId = validateUserId(user?.id);
  const friendId = validateUserId(friend?.id);

  let group = await Group.findAll({
    include: [
      {
        model: GroupMember,
        where: {
          [Op.or]: [
            {
              UserId: userId,
            },
            {
              UserId: friendId,
            },
          ],
        },
      },
    ],
  }).filter(g => g.GroupMembers.length === 2)[0];

  if (!group) {
    await sequelize.transaction(async (t) => {
      const createdGroup = await Group.create({}, {
        transaction: t,
      });

      const toCreateGroupMembers = [
        {
          GroupId: createdGroup.id,
          UserId: userId,
        },
        {
          GroupId: createdGroup.id,
          UserId: friendId,
        },
      ]; 

      const createdGroupMembers = await GroupMember.bulkCreate(toCreateGroupMembers, {
        transaction: t,
      });
    });
  }

  return group;
}

module.exports = {
  getGroupMembers,
  getMessage,
  fileAction,
  getMessages,
  getGroupMembersFromUserId,
  getUser,
  getGroup,
  getDmGroup,
}
