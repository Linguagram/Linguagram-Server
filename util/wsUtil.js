"use strict";

const {
  User,
  Media,
  Message,
  GroupMember,
  Group,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");
const { validateGroupId, validateUserId } = require("./validators");

const getUserWs = async (userId) => {
  const user = await User.findByPk(userId, userFetchAttributes(Media));

  if (!user) throw {
    error: true,
    message: "Unknown user",
  };

  return user;
}

const getGroupMembersWs = async (groupId, userId) => {
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

  return groupMembers;
}

const onMessage = async (message) => {
  if (!message) throw {
    error: true,
    message: "Message can't be empty",
  };

  const groupId = validateGroupId(message.GroupId);
  const userId = validateUserId(message.UserId);

  const groupMembers = await getGroupMembersWs(groupId, userId);

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
