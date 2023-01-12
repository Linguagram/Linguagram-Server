"use strict";

const { inspect } = require("util");
const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')
const Controller = require("../controllers");

const userRouter = require('./userRouter');
const groupsRouter = require("./groups");
const friendsRouter = require("./friends");

// ======= Controller imports

const { Op } = require("sequelize");

const { upload } = require("../util/multer");
const {
  Language,
  UserLanguage,
  Interest,
  User,
  Group,
  GroupMember,
  Friendship
} = require("../models")

const handleUploaded = require('../util/handleUploaded');

const {
  getUser, fileAction, getGroupMembersFromUserId,
} = require("../util/restUtil");

const {
  validateUserId,
} = require('../util/validators');

const translate = require('translate-google');
const { userFetchAttributes, friendshipFetchAttributes } = require('../util/fetchAttributes');
const { sendUserUpdate, isOnline } = require("../util/ws");

// ======= Controller imports end

// get all interests
router.get("/interests", async (req, res, next) => {
  // try {
    const interests = await Interest.findAll();

    res.status(200).json(interests);
  // } catch (err) {
  //   next(err);
  // }
});

// get all languages
router.get("/languages", async (req, res, next) => {
  // try {
    const languages = await Language.findAll();

    res.status(200).json(languages);
  // } catch (err) {
  //   next(err);
  // }
});

router.use(userRouter);
router.use(authentication);

router.post("/users/avatar", upload.single("avatar"), async (req, res, next) => {
  try {
    const userId = req.userInfo.id;

    if (!req.file) {
      throw {
        status: 400,
        message: "avatar is required",
      };
    }

    const newAvatar = await handleUploaded(req.file);

    const user = await getUser(userId);

    user.AvatarId = newAvatar.id;

    await user.save();

    user.dataValues.Avatar = newAvatar;

    res.status(201).json(user);

    sendUserUpdate(user);
  } catch (err) {
    next(err);
  }
});

// pathc user status
router.patch("/users/status", async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status?.length) {
      throw {
        status: 400,
        message: "Status is required",
      };
    }

    const userId = req.userInfo.id;

    const user = await getUser(userId);

    user.status = status;

    await user.save();

    res.status(200).json(user);

    sendUserUpdate(user);
  } catch (err) {
    next(err);
  }
});

// delete avatar
router.delete("/users/avatar", async (req, res, next) => {
  // try {
    const userId = req.userInfo.id;

    const user = await getUser(userId);

    user.AvatarId = null;

    await user.save();

    delete user.dataValues.Avatar;

    res.status(200).json(user);

    sendUserUpdate(user);
  // } catch (err) {
  //   next(err);
  // }
});

router.put("/users/@me", Controller.editMe);
router.get("/users/@me", Controller.getUser);

// /groups path
router.use(groupsRouter);

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

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// get user languages
router.get("/languages/@me", async (req, res, next) => {
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

// translate user message
router.post("/translate", async (req, res, next) => {
  try {
    const { text, from, to } = req.body;
    if (!text?.length) throw {
      status: 400,
      message: "Text is required",
    };

    const nativeLanguages = req.userInfo.UserLanguages.filter(lang => lang.type === "native").map(lang => lang.Language.name);
    const toLang = to || nativeLanguages[0];

    if (!toLang) throw {
      status: 400,
      message: "No target language specified",
    };

    const opts = {
      from: from || "auto",
      to: toLang,
    };

    const result = await translate(text, opts);


    res.status(200).json({ translated: result });
  } catch (err) {
    if (err.message.startsWith('The language ')) {
      next({
        status: 400,
        message: err.message
      })
      return
    }
    next(err);
  }
});

// explore users
router.get("/explore/users", async (req, res, next) => {
  try {
    const opts = userFetchAttributes();

    const includeUserLang = opts.include[1];
    const includeLang = includeUserLang.include[0];

    includeUserLang.where = {
      type: "native",
    };

    const orNatives = [];

    for (const lang of req.userInfo.UserLanguages.filter(uLang => uLang.type === "interest")) {
      orNatives.push({
        name: lang.Language.name,
      });
    }

    includeLang.where = {
      [Op.or]: orNatives,
    };

    // const includeInter = opts.include[2].include[0];

    // const orInterests = [];

    // for (const interest of req.userInfo.UserInterests) {
    //   orInterests.push({
    //     name: interest.Interest.name,
    //   });
    // }

    // includeInter.where = {
    //   [Op.or]: orInterests,
    // };

    // console.log(opts);
    console.log(inspect(opts, false, 10, true));
    let users = await User.findAll(opts);

    const friends = await Friendship.findAll(friendshipFetchAttributes(req.userInfo.id));

    for (const friend of friends) {
      users = users.filter(user => (user.dataValues.id !== friend.UserId && user.dataValues.id !== friend.FriendId))
    }

    // for(const x in users){
    //   console.log(users[x].dataValues,'<<<<');
    //   for(const friend of friends){
    //     if(users[x].dataValues.id==friend.UserId || users[x].dataValues.id==friend.FriendId ){
    //       delete users[x]
    //       break
    //     }
    //   }
    // }

    users = await User.findAll({
      ...userFetchAttributes(),
      where: {
        [Op.or]: users.map(u => ({id: u.id})),
      },
    });

    for (const user of users) {
      user.dataValues.isOnline = isOnline(user.id);
    }

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

// explore groups
router.get("/explore/groups", async (req, res, next) => {
  try {
    let groups = await Group.findAll({
      where: {
        type: "group",
      },
      include: [
        {
          model: GroupMember,
          include: [
            {
              ...userFetchAttributes(),
              model: User,
            },
          ],
        },
      ],
    });

    let groupMembers = await getGroupMembersFromUserId(req.userInfo.id);
    groupMembers = (groupMembers.map(gm => gm.Group))
    for (const member of groupMembers) {
      groups = groups.filter(group => (group.dataValues.id !== member.id))
    }

    res.status(200).json(groups);
  } catch (err) {
    next(err);
  }
});

router.post("/attachment", upload.single("attachment"), async (req, res, next) => {
  try {
    if (!req.file) throw {
      status: 400,
      message: "attachment is required",
    };

    const newAttachment = await fileAction(req);

    res.status(201).json(newAttachment);
  } catch (err) {
    next(err);
  }
});

module.exports = router

// vim: sw=2 et
