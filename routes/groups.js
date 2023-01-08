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
  getDmGroup,
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

router.patch("/groups/:groupId/messages", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);

    // check if user is in this group
    const groupMembers = await getGroupMembers(groupId, req);

    await Message.update({ isRead: true }, {
      where: {
        GroupId: groupId,
        isRead: false,
      },
    });

    res.status(200).json({ isRead: true });
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


    newMessage.dataValues.User.dataValues.isOnline = isOnline(newMessage.dataValues.User.dataValues.id); // masih error tidak ada id di newMessage.User

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

    if (!newAttachment) {
      await message.update({ MediaId: null })
      delete message.dataValues.Medium
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

    const groupMembers = await getGroupMembers(groupId, req);
    const message = await getMessage(messageId, groupId);
    if (message.deleted) {
      throw {
        status: 400,
        message: "This message has already been deleted",
      };
    }

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
    res.status(200).json((groupMembers.map(gm => gm.Group)).map(gr => {
      const temp = gr.dataValues.GroupMembers.map(mem => {
        const memtemp = mem.dataValues.User.dataValues
        delete memtemp.password
        mem.dataValues.User.dataValues = memtemp
        return mem
      })
      const converted = Number(gr.dataValues.unreadMessageCount)
      gr.dataValues.unreadMessageCount = converted
      gr.dataValues.GroupMembers = temp
      return gr
    }));
  } catch (err) {
    next(err);
  }
});

// create groups
router.post("/groups", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name?.length) {
      throw {
        status: 400,
        message: "Group name is required",
      };
    }

    let group, groupMember;

    await sequelize.transaction(async (t) => {
      // begin transaction
      group = await Group.create({
        name,
        type: "group",
      }, {
        transaction: t
      });

      groupMember = await GroupMember.create({
        UserId: req.userInfo.id,
        GroupId: group.id,
      }, {
        transaction: t
      });

      const opts = userFetchAttributes();
      opts.transaction = t;

      const user = await User.findByPk(groupMember.UserId, opts);

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

    if (group.type !== "group") throw {
      status: 404,
      message: "Unknown Group",
    };

    const alreadyMember = await GroupMember.findOne({
      where : {
        GroupId: group.id,
        UserId: req.userInfo.id,
      },
    });

    if (alreadyMember) throw {
      status: 400,
      message: "Already a member",
    };

    const newMember = await GroupMember.create({
      GroupId: group.id,
      UserId: req.userInfo.id,
    });

    // newMember.dataValues.isOnline = isOnline(newMember.UserId);

    const members = await getGroupMembers(group.id, req);

    res.status(200).json(newMember);

    sendGroupJoin(members, newMember);
  } catch (err) {
    next(err);
  }
});

// leave user group
router.delete("/groupmembers/:groupId", async (req, res, next) => {
  try {
    const groupId = validateGroupId(req.params.groupId);
    const groupMember = await GroupMember.findOne({
      where: {
        GroupId: groupId,
        UserId: req.userInfo.id,
      },
      include: [Group],
    });

    if (!groupMember) {
      throw {
        status: 404,
        message: "Unknown Group",
      };
    }

    const members = await getGroupMembers(groupId, req);

    await groupMember.destroy();

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

//     const members = groupMember.Group.GroupMembers;
//     await groupMember.destroy();

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

//     const members = await getGroupMembers(groupId, req);
//     await groupMember.destroy();

//     res.status(200).json(groupMember);

//     sendGroupLeave(members, groupMember);
//   } catch (err) {
//     next(err);
//   }
// });

router.get("/groups/:userId", async (req, res, next) => {
  try {
    // strict check groupId
    const userId = validateUserId(req.params.userId);

    const group = await getDmGroup(req.userInfo.id, userId);

    res.status(200).json(group);
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

    sendGroupUpdate(groupMembers, group);
  } catch (err) {
    next(err);
  }
});

// Group chat routes END ======================================

module.exports = router;
