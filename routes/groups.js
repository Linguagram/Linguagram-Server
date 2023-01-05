"use strict";

const router = require("express").Router();

// ========= Controller imports START

const { upload } = require("../util/multer");

const {
  Message,
  GroupMember,
} = require("../models");

const {
  validateGroupId,
  validateMessageId,
  validateUserId,
} = require('../util/validators');

const {
  sendMessage,
  editMessage,
  deleteMessage,
  sendGroupJoin,
  sendGroupLeave,
} = require("../util/ws");

const {
  getUser,
  getMessage,
  getGroupMembers,
  getGroupMembersFromUserId,
  fileAction,
  getMessages,
  getGroup,
} = require("../util/restUtil");

// ========= Controller imports END

router.get("/groups/:groupId/messages", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);

    // check if user is in this group
    const groupMembers = await getGroupMembers(groupId, req);

    const messages = await getMessages(groupId);

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
});

router.post("/groups/:groupId/messages", upload.single("attachment"), async (req, res, next) => {
  try {
    const groupId = validateGroupId(req.params.groupId);

    const groupMembers = await getGroupMembers(groupId, req);

    const newAttachment = await fileAction(req);

    const {
      content,
    } = req.body;

    if (!content && !newAttachment) {
      throw {
        status: 400,
        message: "One upload or text content is required",
      };
    }

    const createMessage = {
      content,
      GroupId: groupId,
      UserId: req.userInfo.id,
    };

    if (newAttachment?.id) {
      createMessage.MediaId = newAttachment.id;
    }

    const newMessage = await Message.create(createMessage);
    newMessage.User = req.userInfo;

    if (newAttachment?.id) {
      newMessage.Media = newAttachment;
    }

    sendMessage(groupMembers, newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
});

router.get("/groups/:groupId/messages/:messageId", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);
    //
    // check if user is in this group
    const groupMembers = await getGroupMembers(groupId, req);

    const messageId = validateMessageId(req.params.messageId);

    const message = await getMessage(messageId, groupId);

    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
});

router.put("/groups/:groupId/messages/:messageId", upload.single("attachment"), async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);
    const messageId = validateMessageId(req.params.messageId);

    const groupMembers = await getGroupMembers(groupId, req);

    const message = await getMessage(messageId, groupId);

    const newAttachment = await fileAction(req);

    const {
      content,
    } = req.body;

    if (!content && !newAttachment) {
      throw {
        status: 400,
        message: "One upload or text content is required",
      };
    }

    if (newAttachment?.id) {
      message.MediaId = newAttachment.id;
    }

    message.content = content;

    await message.save();

    message.User = req.userInfo;

    if (newAttachment?.id) {
      message.Media = newAttachment;
    }

    message.edited = true;

    editMessage(groupMembers, message);

    res.status(200).json(message);
  } catch (err) {
    next(err);
  }
});

router.delete("/groups/:groupId/messages/:messageId", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);
    const messageId = validateMessageId(req.params.messageId);

    const message = await getMessage(messageId, groupId);

    const groupMembers = await getGroupMembers(groupId, req);

    message.deleted = true;
    await message.save();

    const response = {
      id: message.id,
    };

    deleteMessage(groupMembers, response);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// get user
router.get("/users/:userId", async (req, res, next) => {
  try {
    const user = await getUser(validateUserId(req.params.userId));

    if (!user) {
      throw {
        status: 404,
        message: "Unknown user",
      };
    }

    res.status(200).json();
  } catch (err) {
    next(err);
  }
});

// get user groups
router.get("/groups", async (req, res, next) => {
  try {
    const groupMembers = await getGroupMembersFromUserId(req.userInfo.id);

    res.status(200).json(groupMembers);
  } catch (err) {
    next(err);
  }
});

// Group chat routes START ======================================
// join user group
router.post("/groups/:groupId/join", async (req, res, next) => {
  try {
    const group = await getGroup(validateGroupId(req.params.groupId));

    const alreadyMember = await GroupMember.findByPk(req.userInfo.id);

    if (alreadyMember) throw {
      status: 400,
      message: "Already a member",
    };

    const newMember = await GroupMember.create({
      GroupId: group.id,
      UserId: req.userInfo.id,
    });

    const members = await getGroupMembers(group.id, req);

    res.status(200).json(newMember);

    sendGroupJoin(members, newMember);
  } catch (err) {
    next(err);
  }
});

// leave user group
router.post("/groups/:groupId/leave", async (req, res, next) => {
  try {
    const groupId = validateGroupId(req.params.groupId);
    const groupMember = await GroupMember.findOne({
      where: {
        GroupId: validateGroupId(req.params.groupId),
        UserId: req.userInfo.id,
      },
    });

    if (!groupMember) {
      throw {
        status: 404,
        message: "Unknown Group",
      };
    }

    await groupMember.destroy();
    const members = await getGroupMembers(groupId, req);

    res.status(200).json(groupMember);

    sendGroupLeave(members, groupMember);
  } catch (err) {
    next(err);
  }
});

router.put("/groups/:groupId", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);

    // check if user is in this group
    const groupMembers = await getGroupMembers(groupId, req);

    const group = await getGroup(groupId);

    const { name } = req.body;

    group.name = name;

    await group.save;

    res.status(200).json(group);
  } catch (err) {
    next(err);
  }
});

// Group chat routes END ======================================

module.exports = router;
