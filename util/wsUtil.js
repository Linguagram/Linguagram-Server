"use strict";

const {
  User,
  Media,
  Message,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");
const { baseGetGroupMembers } = require("./restUtil");
const { validateGroupId, validateUserId } = require("./validators");

const getUserWs = async (userId) => {
  const user = await User.findByPk(userId, userFetchAttributes(Media));

  if (!user) throw {
    error: true,
    message: "Unknown user",
  };

  return user;
}

const onMessage = async (message) => {
  if (!message) throw {
    error: true,
    message: "Message can't be empty",
  };

  const groupId = validateGroupId(message.GroupId);
  const userId = validateUserId(message.UserId);

  const groupMembers = await baseGetGroupMembers(groupId, userId);

  const newAttachment = { id: message.MediaId };

  const {
    content,
  } = message;

  if (!content && !newAttachment.id) {
    throw {
      status: 400,
      message: "One upload or text content is required",
    };
  }

  const createMessage = {
    content,
    GroupId: groupId,
    UserId: userId,
  };

  if (newAttachment.id) {
    createMessage.MediaId = newAttachment.id;
  }

  const createdMessage = await Message.create(createMessage);

  const newMessage = await Message.findByPk(createdMessage.id, {
    include: [
      {
        ...userFetchAttributes(),
        model: User,
      },
      {
        model: Media,
      },
    ],
  });

  return {
    groupMembers,
    newMessage,
  };
}

module.exports = {
  getUserWs,
  onMessage,
}
