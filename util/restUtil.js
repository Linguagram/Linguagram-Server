"use strict";

const {
  Media, User, Message, GroupMember
} = require("../models")

const handleUploaded = require("./handleUploaded");

const getGroupMembers = async (groupId, req) => {
  const groupMembers = await GroupMember.findAll({
    where: {
      GroupId: groupId,
    },
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

const getMessages = async (groupId) => {
  const messages = await Message.findAll({
    where: {
      GroupId: groupId,
    },
    include: [User, Media],
  });

  return messages;
}

const getMessage = async (messageId, groupId) => {
  const message = await Message.findByPk(messageId, {
    where: {
      GroupId: groupId,
    },
    include: [User, Media],
  });

  if (!message) {
    throw {
      status: 404,
      message: "Unknown message",
    };
  }

  return message;
}

const fileAction = async (req) => {
  // handle uploaded attachment if any
  if (req.file) {
    return handleUploaded(req.file);
  }
}

module.exports = {
  getGroupMembers,
  getMessage,
  fileAction,
  getMessages,
}
