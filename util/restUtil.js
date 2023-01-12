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

const {
  userFetchAttributes,
  messagesFetchAttributes,
  groupFetchAttributes,
} = require("./fetchAttributes");

const handleUploaded = require("./handleUploaded");
const { isOnline } = require("./ws");

const baseGetGroupMembers = async (groupId, userId) => {
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
  if (!groupMembers.some(member => member.UserId === userId)) {
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

const getGroupMember = async (groupMemberId) => {
  const groupMember = await GroupMember.findByPk(groupMemberId, {
    include: [
      {
        model: Group,
        include: [
          {
            model: GroupMember,
            include: [
              {
                ...userFetchAttributes(),
                model: User,
              },
            ],
          }
        ],
      },
      {
        ...userFetchAttributes(),
        model: User,
      },
    ],
  });

  // check if user is actually in the group
  if (!groupMember) {
    throw {
      status: 404,
      message: "Unknown Group Member",
    };
  }

  groupMember.User.dataValues.isOnline = isOnline(groupMember.UserId);

  return groupMember;
}

const getGroupMembers = async (groupId, req) => {
  return baseGetGroupMembers(groupId, req.userInfo.id);
}

const getGroupMembersFromUserId = async (userId) => {
  const groupFetchOpts = groupFetchAttributes(userId);

  groupFetchOpts.include.push({
    ...messagesFetchAttributes(null, true),
    limit: 1,
    model: Message,
  });

  const groupMembers = await GroupMember.findAll({
    where: {
      UserId: userId,
    },
    include: [
      {
        ...groupFetchOpts,
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
  const messages = await Message.findAll(messagesFetchAttributes(groupId));

  return messages.map(message => {
    message.dataValues.edited = new Date(message.createdAt).valueOf() !== new Date(message.updatedAt).valueOf();
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

  message.dataValues.edited = new Date(message.createdAt).valueOf() !== new Date(message.updatedAt).valueOf();

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

const getDmGroup = async (userId, friendId) => {
  let group = (await Group.findAll({
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
        include: [
          {
            ...userFetchAttributes(),
            model: User,
          },
        ],
      },
    ],
    where: {
      type: "dm",
    },
  })).filter(g => g.GroupMembers.length === 2 && [userId, friendId].every(id => g.GroupMembers.some(gm => gm.UserId === id)))[0];

  if (!group) {
    let createdGroup;
    await sequelize.transaction(async (t) => {
      createdGroup = await Group.create({
        type: "dm",
      }, {
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

    group = await getGroup(createdGroup.id);
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
  getGroupMember,
}
