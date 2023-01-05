"use strict";

const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')
const Controller = require("../controllers");

const userRouter = require('./userRouter');
const groupsRouter = require("./groups");
const friendsRouter = require("./friends");

// ======= Controller imports

const { upload } = require("../util/multer");
const {
  Language,
  UserLanguage,
} = require("../models")

const handleUploaded = require('../util/handleUploaded');

const {
  getUser,
} = require("../util/restUtil");

const {
  validateUserId,
} = require('../util/validators');

// ======= Controller imports end

router.use(userRouter)
router.use(authentication)

router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    if (!req.file) {
      throw {
        status: 400,
        message: "avatar is required",
      };
    }

    const newAvatar = await handleUploaded(req.file);

    const user = await getUser(req.userInfo.id);

    user.AvatarId = newAvatar.id;

    await user.save();

    user.Avatar = newAvatar;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// delete avatar
router.delete("/avatar", async (req, res, next) => {
  try {
    const user = await getUser(req.userInfo.id);

    user.AvatarId = null;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// /groups path
router.use(groupsRouter);

// get all languages
router.get("/languages", async (req, res, next) => {
  try {
    const languages = await Language.findAll();

    res.status(200).json(languages);
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


router.post("/groups/:groupName/join", async (req, res, next) => {
  try {
    const group = await Group.findOne({
      where: {
        name: req.params.name,
      },
    });

    if (!group) throw {
      status: 404,
      message: "Group not found",
    };

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

// Group chat routes END ======================================

// get all languages
router.get("/languages", async (req, res, next) => {
  try {
    const languages = await Language.findAll();

    res.status(200).json(languages);
  } catch (err) {
    next(err);
  }
});

// edit user
router.put("/@me", Controller.editMe);

// get user languages
router.get("/@me/languages", async (req, res, next) => {
  try {
    const languages = await UserLanguage.findAll({
      where: {
        UserId: req.userInfo.id,
      },
      include: [Language],
    });

    res.status(200).json(languages);
  } catch (err) {
    next(err);
  }
});

// /friends routes
router.use(friendsRouter);

router.post("/translate", async (req, res, next) => {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
});

module.exports = router

// vim: sw=2 et
