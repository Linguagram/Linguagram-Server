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
} = require('../util/ws');

const {
  getUser,
} = require("../util/restUtil");

const {
  friendshipFetchAttributes,
  oneFriendshipFetchAttributes,
} = require("../util/fetchAttributes");

// ========= Controller imports END

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

    newFriend.dataValues.User = req.userInfo;

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

module.exports = router;
