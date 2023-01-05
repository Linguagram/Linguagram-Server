"use strict";

const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')
const Controller = require("../controllers");

const userRouter = require('./userRouter');
const groupsRouter = require("./groups");

// ======= Controller imports

const { upload } = require("../util/multer");
const {
  Language,
  UserLanguage,
  Friendship,
} = require("../models")
const handleUploaded = require('../util/handleUploaded');
const {
  validateUserId,
  validateFriendId,
} = require('../util/validators');
const {
  sendFriendRequest,
  acceptedFriendRequest,
  deletedFriendRequest,
} = require('../util/ws');

const {
  getUser,
} = require("../util/restUtil");

const {
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
} = require("../util/fetchAttributes");

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
    const friends = await Friendship.findAll(friendshipFetchAttributes(req.userInfo.id));

    res.status(200).json(friends);
  } catch (err) {
    next(err);
  }
});

// send friend request
router.post("/friends/:friendId", async (req, res, next) => {
  try {
    const friend = await getUser(validateFriendId(req.params.friendId));

    if (!friend) throw {
      status: 404,
      message: "Friend not found",
    };

    const alreadyFriend = await Friendship.findOne(oneFriendshipFetchAttributes(req.userInfo.id, friend.id));

    if (alreadyFriend) {
      throw {
        status: 400,
        message: "Already has friendship in progress",
      };
    }

    const newFriend = await Friendship.create({
      FriendId: friend.id,
      UserId: req.userInfo.id,
    });

    newFriend.User = req.userInfo;

    res.status(200).json(newFriend);

    sendFriendRequest(friend, newFriend);
  } catch (err) {
    next(err);
  }
});

// accept friend request
router.patch("/friendships/:userId", async (req, res, next) => {
  try {
    const friendship = await Friendship.findOne(oneFriendshipFetchAttributes(req.userInfo.id, validateUserId(req.params.userId)));

    if (friendship.isAccepted) {
      throw {
        status: 400,
        message: "Friend request already accepted",
      };
    }

    friendship.isAccepted = true;

    await friendship.save();

    res.status(200).json(friendship);

    acceptedFriendRequest(friendship.User, friendship);
  } catch (err) {
    next(err);
  }
});

router.delete("/friendships/:friendId", async (req, res, next) => {
  try {
    const friendship = await Friendship.findOne(oneFriendshipFetchAttributes(req.userInfo.id, validateUserId(req.params.userId)));

    if (friendship.isAccepted) {
      throw {
        status: 400,
        message: "Friend request already accepted",
      };
    }

    friendship.isAccepted = true;

    await friendship.save();

    res.status(200).json(friendship);

    deletedFriendRequest(friendship.User.id === req.userInfo.id ? friendship.Friend.id : friendship.User.id, friendship);
  } catch (err) {
    next(err);
  }
});

router.post("/translate", async (req, res, next) => {
  try {
    // TODO
  } catch (err) {
    next(err);
  }
});

module.exports = router

// vim: sw=2 et
