"use strict";

const {
  User,
  Media,
  Message,
  GroupMember,
  Group,
} = require("../models");
const { userFetchAttributes } = require("./fetchAttributes");
const { validateGroupId, validateUserId, validateMessageId } = require("./validators");

const getUserWs = async (userId) => {
  const user = await User.findByPk(userId, userFetchAttributes(Media));

  if (!user) throw {
    status: 404,
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

const onMessage = async (data) => {
  if (!data) throw {
    status: 400,
    message: "data can't be empty",
  };

  const { content, GroupId, UserId, MediaId } = data;

  const groupId = validateGroupId(GroupId);
  const userId = validateUserId(UserId);

  const groupMembers = await getGroupMembersWs(groupId, userId);

  const newAttachment = { id: MediaId };

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

  const newMessage = await getMessageWs(createdMessage.id, createdMessage.GroupId);

  return {
    groupMembers,
    newMessage,
  };
}

const getMessageWs = async (messageId, groupId) => {
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
      }
    ],
  });

  if (!message) {
    throw {
      status: 404,
      message: "Unknown message",
    };
  }

  message.dataValues.edited = message.createdAt.valueOf() !== message.updatedAt.valueOf();

  return message;
}

const onMessageEdit = async (data) => {
  if (!data) throw {
    status: 400,
    message: "data can't be empty",
  };

  const { content, MessageId, GroupId, UserId } = data;

  if (!content) throw {
    status: 400,
    message: "Content is required to edit message",
  };

  // strict check groupId
  const groupId = validateGroupId(GroupId);
  const messageId = validateMessageId(MessageId);
  const userId = validateUserId(UserId);

  const groupMembers = await getGroupMembersWs(groupId, userId);

  const message = await getMessageWs(messageId, groupId);

  if (message.UserId !== userId) throw {
    status: 403,
    message: "Forbidden",
  };

  message.content = content;

  await message.save();

  message.dataValues.edited = true;

  return {
    groupMembers,
    message,
  };
}

const onMessageDelete = async (data) => {
  if (!data) throw {
    status: 400,
    message: "data can't be empty",
  };

  const { MessageId, GroupId, UserId } = data;
  // strict check groupId
  const groupId = validateGroupId(GroupId);
  const messageId = validateMessageId(MessageId);
  const userId = validateMessageId(UserId);

  const groupMembers = await getGroupMembersWs(groupId, userId);

  const message = await getMessageWs(messageId, groupId);

  if (message.UserId !== userId) throw {
    status: 403,
    message: "Forbidden",
  };

  if (message.deleted) {
    throw {
      status: 400,
      message: "This message has already been deleted",
    };
  }

  message.deleted = true;
  await message.save();

  return {
    groupMembers,
    message,
  };
}

module.exports = {
  getUserWs,
  onMessage,
  onMessageEdit,
  onMessageDelete,
}
