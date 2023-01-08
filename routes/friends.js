"use strict";

const router = require("express").Router();

// ========= Controller imports START

const {
  Friendship,
} = require("../models")

const {
  validateUserId,
  validateFriendId,
} = require('../util/validators');

const {
  sendFriendRequest,
  acceptedFriendRequest,
  deletedFriendRequest,
  isOnline,
} = require('../util/ws');

const {
  getUser,
} = require("../util/restUtil");

const {
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
} = require("../util/fetchAttributes");
const { sendNewFriendReqMail } = require("../helpers/nodemailer");

// ========= Controller imports END

// get user friends
router.get("/friends", async (req, res, next) => {
  try {
    const friends = await Friendship.findAll(friendshipFetchAttributes(req.userInfo.id));

    for (const friend of friends) {
      friend.dataValues.User.dataValues.isOnline = isOnline(friend.User.id);
      friend.dataValues.Friend.dataValues.isOnline = isOnline(friend.Friend.id);
    }

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

    newFriend.dataValues.User = req.userInfo;
    newFriend.dataValues.User.dataValues.isOnline = isOnline(req.userInfo.id);
    newFriend.dataValues.Friend.dataValues.isOnline = isOnline(newFriend.dataValues.Friend.id);

    res.status(200).json(newFriend);

    sendFriendRequest(friend, newFriend);

    sendNewFriendReqMail(friend.email, friend.username);
  } catch (err) {
    next(err);
  }
});

// accept friend request
router.patch("/friendships/:userId", async (req, res, next) => {
  try {
    const userId = validateUserId(req.params.userId);

    const friendship = await Friendship.findOne(oneFriendshipFetchAttributes(req.userInfo.id, userId));

    if (!friendship) throw {
      status: 404,
      message: "Friendship not found",
    };

    if (friendship.FriendId !== req.userInfo.id) throw {
      status: 403,
      message: "Forbidden",
    };

    if (friendship.isAccepted) {
      throw {
        status: 400,
        message: "Friend request already accepted",
      };
    }

    friendship.isAccepted = true;

    await friendship.save();
    friendship.dataValues.User.dataValues.isOnline = isOnline(req.userInfo.id);
    friendship.dataValues.Friend.dataValues.isOnline = isOnline(friendship.Friend.id);

    res.status(200).json(friendship);

    acceptedFriendRequest(friendship.User, friendship);
  } catch (err) {
    next(err);
  }
});

router.delete("/friendships/:friendId", async (req, res, next) => {
  try {
    const friendId = validateUserId(req.params.friendId);
    const friendship = await Friendship.findOne(oneFriendshipFetchAttributes(req.userInfo.id, friendId));

    if (!friendship) throw {
      status: 404,
      message: "Friendship not found",
    };

    if (![req.userInfo.id, friendId].every(id => [friendship.UserId, friendship.FriendId].includes(id))) {
      throw {
        status: 403,
        message: "Forbidden",
      };
    }

    await friendship.destroy();

    friendship.dataValues.User.dataValues.isOnline = isOnline(req.userInfo.id);
    friendship.dataValues.Friend.dataValues.isOnline = isOnline(friendship.Friend.id);

    res.status(200).json(friendship);

    deletedFriendRequest(friendship.User.id === req.userInfo.id ? friendship.Friend.id : friendship.User.id, friendship);
  } catch (err) {
    next(err);
  }
});

// ===================================

module.exports = router;
