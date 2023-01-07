"use strict";

const router = require("express").Router();

// ========= Controller imports START

const { upload } = require("../util/multer");

const {
  Message,
  GroupMember,
  Group,
  User,
  sequelize,
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
  isOnline,
  sendGroupUpdate,
} = require("../util/ws");

const {
  getMessage,
  getGroupMembers,
  getGroupMembersFromUserId,
  fileAction,
  getMessages,
  getGroup,
} = require("../util/restUtil");
const { userFetchAttributes } = require("../util/fetchAttributes");

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
    newMessage.dataValues.User = req.userInfo;

    if (newAttachment?.id) {
      newMessage.dataValues.Medium = newAttachment;
    }

    newMessage.dataValues.User.dataValues.isOnline = isOnline(newMessage.User.id);

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
    message.dataValues.User.dataValues.isOnline = isOnline(message.User.id);

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

    if(!newAttachment){
      message.MediaId = null 
    }

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

    message.dataValues.User = req.userInfo;

    if (newAttachment?.id) {
      message.dataValues.Medium = newAttachment;
    }

    message.dataValues.User.dataValues.isOnline = isOnline(message.User.id);

    message.dataValues.edited = true;

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
    if (message.deleted) {
      throw {
        status: 400,
        message: "This message has already been deleted",
      };
    }
    const groupMembers = await getGroupMembers(groupId, req);

    message.deleted = true;
    await message.save();

    const response = {
      id: message.id,
      deleted: true,
      Group: message.Group,
      UserId: req.userInfo.id,
      User: message.User,
    };

    response.User.dataValues.isOnline = isOnline(response.User.id);

    deleteMessage(groupMembers, response);

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// get user groups
router.get("/groups/@me", async (req, res, next) => {
  try {
    const groupMembers = await getGroupMembersFromUserId(req.userInfo.id);

    res.status(200).json(groupMembers.map(gm => gm.Group));
  } catch (err) {
    next(err);
  }
});

// create groups
router.post("/groups", async (req, res, next) => {
  try {
    const { name, type } = req.body;

    let group, groupMember;

    await sequelize.transaction(async (t) => {
      // begin transaction
      group = await Group.create({
        name,
        type,
      }, {
          transaction: t
        });

      groupMember = await GroupMember.create({
        UserId: req.userInfo.id,
        GroupId: group.id,
      }, {
          transaction: t
        });

      const user = await User.findByPk(userFetchAttributes(), {
        transaction: t,
      });

      user.dataValues.isOnline = isOnline(user.id);

      groupMember.dataValues.User = user;
    });

    group.dataValues.GroupMembers = [groupMember];

    res.status(201).json(group);
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

    newMember.dataValues.isOnline = isOnline(newMember.id);

    const members = await getGroupMembers(group.id, req);

    res.status(200).json(newMember);

    sendGroupJoin(members, newMember);
  } catch (err) {
    next(err);
  }
});

// leave user group
router.delete("/groups/:groupId/:userId", async (req, res, next) => {
  try {
    if (req.userInfo.id !== validateUserId(req.params.userId)) throw {
      status: 403,
      message: "Forbidden",
    };

    const groupId = validateGroupId(req.params.groupId);
    const groupMember = await GroupMember.findOne({
      where: {
        GroupId: groupId,
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

// leave user group
// router.delete("/groupmembers/:groupMemberId", async (req, res, next) => {
//   try {
//     const groupMemberId = validateGroupId(req.params.groupMemberId);
//     const groupMember = await GroupMember.findByPk(groupMemberId, {
//       include: [
//         {
//           model: Group,
//           include: [GroupMember],
//         },
//       ],
//     });

//     if (!groupMember) {
//       throw {
//         status: 404,
//         message: "Unknown Group Member",
//       };
//     }

//     await groupMember.destroy();
//     const members = groupMember.Group.GroupMembers;

//     res.status(200).json(groupMember);

//     sendGroupLeave(members, groupMember);
//   } catch (err) {
//     next(err);
//   }
// });

// leave user group
// router.delete("/groups/:groupId/@me", async (req, res, next) => {
//   try {
//     const groupId = validateGroupId(req.params.groupId);
//     const groupMember = await GroupMember.findOne({
//       where: {
//         GroupId: groupId,
//         UserId: req.userInfo.id,
//       },
//     });

//     if (!groupMember) {
//       throw {
//         status: 404,
//         message: "Unknown Group",
//       };
//     }

//     await groupMember.destroy();
//     const members = await getGroupMembers(groupId, req);

//     res.status(200).json(groupMember);

//     sendGroupLeave(members, groupMember);
//   } catch (err) {
//     next(err);
//   }
// });

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

    sendGroupUpdate(groupMembers, group);
  } catch (err) {
    next(err);
  }
});

// Group chat routes END ======================================

module.exports = router;
