"use strict";

const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')
const Controller = require("../controllers");

const userRouter = require('../routes/userRouter');

// ======= Controller imports

const { Op } = require("sequelize");
const { upload } = require("../util/multer");
const {
  Message,
  Language,
  UserLanguage,
  Friendship,
  User,
} = require("../models")
const handleUploaded = require('../util/handleUploaded');
const {
  validateGroupId,
  validateMessageId,
  validateUserId,
  validateFriendId,
} = require('../util/validators');
const { sendMessage, editMessage, deleteMessage } = require('../util/ws');

const {
  getMessage,
  getGroupMembers,
  getGroupMembersFromUserId,
  fileAction,
  getMessages,
  getUser,
} = require("../util/restUtil");

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

// Group chat routes
// // join user group
// router.delete("/@me/groups/:groupId", async (req, res, next) => {
//   try {
//     res.status(200).json(await User.findByPk(req.params.userId));
//   } catch (err) {
//     next(err);
//   }
// });
// 
// // leave user group
// router.delete("/@me/groups/:groupId", async (req, res, next) => {
//   try {
//     res.status(200).json(await User.findByPk(req.params.userId));
//   } catch (err) {
//     next(err);
//   }
// });


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

// get user friends
router.get("/friends", async (req, res, next) => {
  try {
    const friends = await Friendship.findAll({
      where: {
        [Op.or]: [
          {
            UserId: req.userInfo.id,
          },
          {
            FriendId: req.userInfo.id,
          },
        ],
      },
      include: [
        {
          model: User,
          as: "User",
        },
        {
          model: User,
          as: "Friend",
        },
      ],
    });

    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
});

// send friend request
router.post("/friends/:friendId", async (req, res, next) => {
  try {
    const friend = await getUser(validateFriendId(req.params.friendId));
    // !TODO
    res.status(200).json(null);
  } catch (err) {
    next(err);
  }
});

module.exports = router

// vim: sw=2 et
