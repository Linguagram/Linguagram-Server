"use strict";

const {
  Media,
  User,
  Message,
  GroupMember,
  Group,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");

const handleUploaded = require("./handleUploaded");

const getGroupMembers = async (groupId, req) => {
  const groupMembers = await GroupMember.findAll({
    where: {
      GroupId: groupId,
    },
    include: [Group],
  });

  // check if user is actually in the group
  if (!groupMembers.some(member => member.UserId === req.userInfo.id)) {
    throw {
      status: 404,
      message: "Unknown Group",
    };
  }

  return groupMembers;
}

const getGroupMembersFromUserId = async (userId) => {
  const groupMembers = await GroupMember.findAll({
    where: {
      UserId: userId,
    },
    include: [Group],
  });

  return groupMembers;
}

const getMessages = async (groupId) => {
  const messages = await Message.findAll({
    where: {
      GroupId: groupId,
      deleted: false,
    },
    include: [User, Media, Group],
  });

  return messages.map(message => {
    message.edited = message.createdAt !== message.updatedAt;

    return message;
  });
}

const getMessage = async (messageId, groupId) => {
  const message = await Message.findByPk(messageId, {
    where: {
      GroupId: groupId,
      deleted: false,
    },
    include: [User, Media, Group],
  });

  if (!message) {
    throw {
      status: 404,
      message: "Unknown message",
    };
  }

  message.edited = message.createdAt !== message.updatedAt;

  return message;
}

const fileAction = async (req) => {
  // handle uploaded attachment if any
  if (req.file) {
    return handleUploaded(req.file);
  }
}

const getUser = async (userId) => {
  return User.findByPk(userId, userFetchAttributes(Media));
}

module.exports = {
  getGroupMembers,
  getMessage,
  fileAction,
  getMessages,
  getGroupMembersFromUserId,
  getUser,
}
