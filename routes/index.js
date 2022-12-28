const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

// ======= Controller imports
//
const { upload } = require("./util/multer");
const { Media, User, Message } = require("./models")
const handleUploaded = require('../util/handleUploaded');

// ======= Controller imports

const userRouter = require('../routes/userRouter');





router.use('/users', userRouter)

router.use(authentication)

router.post("/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    const newAvatar = await handleUploaded(req.file);

    const user = await User.findByPk(req.userInfo.id, {
      attributes: [
	"id",
	"username",
	"email",
	"country",
	"status",
	"phoneNumber",
	"verified",
	"AvatarId",
      ],
      include: [
	{
	  model: Media,
	  as: "Avatar",
	},
      ],
    });

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
    const groupId = Number(req.params.groupId);
    if (isNaN(groupId)) {
      throw {
	status: 400,
	message: "Invalid groupId",
      };
    }
    const messages = await Message.findAll({
      where: {
	GroupId: groupId,
      },
    });

  } catch (err) {
    next(err);
  }
});

router.post("/groups/:groupId/messages", upload.single("attachment"), async (req, res, next) => {});

router.get("/groups/:groupId/messages/:messageId", async (req, res, next) => {});

router.put("/groups/:groupId/messages/:messageId", upload.single("attachment"), async (req, res, next) => {});

router.delete("/groups/:groupId/messages/:messageId", async (req, res, next) => {});





module.exports = router
