const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const userRouter = require('../routes/userRouter');

// ======= Controller imports
//
const { upload } = require("../util/multer");
const {
  Media, User, Message,
} = require("../models")
const handleUploaded = require('../util/handleUploaded');
const { validateGroupId, validateMessageId } = require('../util/validators');
const { sendMessage, editMessage, deleteMessage } = require('../util/ws');
const { userFetchAttributes } = require('../util/fetchAttributes');

const {
  getMessage,
  getGroupMembers,
  fileAction,
  getMessages,
} = require("../util/restUtil");

// ======= Controller imports end

router.use('/users', userRouter)

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

    const user = await User.findByPk(req.userInfo.id, userFetchAttributes(Media));

    user.AvatarId = newAvatar.id;

    await user.save();

    user.Avatar = newAvatar;

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/groups/:groupId/messages", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);

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

router.get("/groups/:userId", async (req, res, next) => {
  try {
    // strict check groupId
    const groupId = validateGroupId(req.params.groupId);

    const groupMembers = await getGroupMembers(groupId, req);

    // TODO: here and edit/deleteMessage socket

  } catch (err) {
    next(err);
  }
});





module.exports = router
