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
