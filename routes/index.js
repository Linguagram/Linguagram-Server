const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const userRouter = require('../routes/userRouter');

// ======= Controller imports
//
const { upload } = require("./util/multer");
const {
  Media, User, Message, GroupMember
} = require("./models")
const handleUploaded = require('../util/handleUploaded');
const { validateGroupId } = require('../util/validators');
const { sendMessage } = require('../util/ws');
const { userFetchAttributes } = require('../util/fetchAttributes');

// ======= Controller imports





router.use('/users', userRouter)

router.use(authentication)

router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
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

    const messages = await Message.findAll({
      where: {
	GroupId: groupId,
      },
      include: [User, Media],
    });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
});

router.post("/groups/:groupId/messages", upload.single("attachment"), async (req, res, next) => {
  try {
    const groupId = validateGroupId(req.params.groupId);

    // check if user is actually in the group
    const groupMembers = await GroupMember.findAll({
      where: {
	GroupId: groupId,
      },
    });

    if (!groupMembers.some(member => member.UserId === req.userInfo.id)) {
      throw {
	status: 404,
	message: "Unknown Group",
      };
    }

    let newAttachment;

    // handle uploaded attachment if any
    if (req.file) {
      newAttachment = await handleUploaded(req.file);
    }

    const {
      content,
    } = req.body;

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

router.get("/groups/:groupId/messages/:messageId", async (req, res, next) => {});

router.put("/groups/:groupId/messages/:messageId", upload.single("attachment"), async (req, res, next) => {});

router.delete("/groups/:groupId/messages/:messageId", async (req, res, next) => {});





module.exports = router
