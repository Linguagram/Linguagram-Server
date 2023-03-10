"use strict";

const {
  Schedule,
  User,
  UserLanguage,
  UserSchedule,
  UserInterest,
  sequelize,
} = require('../models')

const { generateHash, verifyHash } = require('../helpers/bcryptjs')
const { signToken, verifyToken } = require('../helpers/jwt')
const { sendMail } = require('../helpers/nodemailer');
const { userFetchAttributes } = require('../util/fetchAttributes');
const { sendUserUpdate } = require('../util/ws');
const { getUser } = require('../util/restUtil');

const { CLIENT_URI } = process.env;

class Controller {

  // USERS
  // register

  static async register(req, res, next) {
    try {
      // Avatar ID belum ada
      const {
        username,
        email,
        password,
        confirmPassword,
        country,
        phoneNumber,
        // Dipisah atau jadi satu array?
        nativeLanguages = [],
        interestLanguages = [],
        interests = [],
      } = req.body;

      if (password && password !== confirmPassword) {
        throw {
          status: 400,
          message: "Password do not match",
        };
      }

      let createdUser;

      await sequelize.transaction(async (t) => {
        // begin transaction
        createdUser = await User.create({
          username,
          email,
          password,
          country,
          phoneNumber
        }, {
          transaction: t
        });

        // create user languages ===
        const createUserLanguages = [
          ...nativeLanguages.map(lang => ({
            type: "native",
            UserId: createdUser.id,
            LanguageId: lang,
          })
          ),
          ...interestLanguages.map(lang => ({
            type: "interest",
            UserId: createdUser.id,
            LanguageId: lang,
          })
          ),
          // filter duplicates
        ]
        .reduce((prev, val) =>
          prev.some(pval =>
            pval.LanguageId === val.LanguageId
            && pval.type === val.type)
            ? prev
            : prev.concat([val]),
          []);

        const newUserLanguages = await UserLanguage.bulkCreate(createUserLanguages, {
          transaction: t,
        });

        const createInterests = [
          ...interests.map(inter => {
            return {
              InterestId: inter,
              UserId: createdUser.id,
            };
          }),
        ];

        const newUserInterests = await UserInterest.bulkCreate(createInterests, {
          transaction: t,
        });
      });

      const opts = userFetchAttributes();

      const newUser = await User.findByPk(createdUser.id, opts);

      // console.log(newUser);

      const verificationId = signToken({id:newUser.id})
      const link = `${CLIENT_URI}/users/verify?verification=${verificationId}`
      console.log(link, CLIENT_URI, "<<<<<<<<<< LINK VERIFICATION");
      sendMail(newUser.email, newUser.username, link)

      const payload = {
        id: newUser.id,
      };

      const access_token = signToken(payload)

      res.status(201).json({
        access_token,
        user: newUser,
      });
    } catch (err) {
      next(err)
    }
  }

  static async editMe(req, res, next) {
    try {
      const {
        username,
        email,
        password,
        newPassword,
        confirmNewPassword,
        country,
        phoneNumber,
        nativeLanguages = [],
        interestLanguages = [],
        interests = [],
      } = req.body;

      if (!password ) {
        throw {
          status: 400,
          message: "Password is required for security",
        };
      }
      else if ( newPassword !== confirmNewPassword) {
        throw {
          status: 400,
          message: "New password do not match",
        };
      }

      const user = await User.findByPk(req.userInfo.id);

      if (!verifyHash(password, user.password)) {
        throw {
          status: 401,
          message: "Invalid old password",
        };
      }

      await sequelize.transaction(async (t) => {
        // begin transaction

        const deletedLanguages = await UserLanguage.destroy({
          where: {
            UserId: user.id,
          },
        }, {
          transaction: t,
        });

        const deletedInterests = await UserInterest.destroy({
          where: {
            UserId: user.id,
          },
        }, {
          transaction: t,
        });

        console.log("User", user.username, user.id, "deleted languages count:", deletedLanguages);
        console.log("User", user.username, user.id, "deleted interests count:", deletedInterests);

        user.username = username;
        user.email = email;
        if (newPassword) user.password = newPassword;

        user.country = country;
        user.phoneNumber = phoneNumber;

        await user.save();

        // create user languages ===
        const createUserLanguages = [...(nativeLanguages.map(lang => ({
            type: "native",
            UserId: user.id,
            LanguageId: lang,
          }))
          ),
          ...(interestLanguages.map(lang => ({
            type: "interest",
            UserId: user.id,
            LanguageId: lang,
          }))
          ),
          // filter duplicates
        ].reduce((prev, val) =>
          prev.some(pval =>
            pval.LanguageId === val.LanguageId
            && pval.type === val.type)
            ? prev
            : prev.concat([val]),
          []);

        const newUserLanguages = await UserLanguage.bulkCreate(createUserLanguages, {
          transaction: t,
        });

        const createInterests = [
          ...interests.map(inter => {
            return {
              InterestId: inter,
              UserId: req.userInfo.id,
            };
          }),
        ];

        const newUserInterests = await UserInterest.bulkCreate(createInterests, {
          transaction: t,
        });
      });

      const opts = userFetchAttributes();

      const newUser = await User.findByPk(user.id, opts);

      console.log(newUser);

      res.status(200).json(newUser);

      sendUserUpdate(newUser);
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body

      if (!email) throw {
        status: 400,
        message: 'Email is required',
      };

      if (!password) throw {
        status: 400,
        message: 'Password is required',
      };

      const loggedInUser = await User.findOne({ where: { email } })
      if (!loggedInUser) throw {
        status: 401,
        message: 'Invalid email/password',
      };

      const isValidPassword = verifyHash(password, loggedInUser.password)
      if (!isValidPassword) throw {
        status: 401,
        message: 'Invalid email/password',
      };

      if (!loggedInUser.verified) {
        const verificationId = signToken({id:loggedInUser.id})
        const link = `${CLIENT_URI}/users/verify?verification=${verificationId}`
        console.log(link, CLIENT_URI, "<<<<<<<<<< LINK VERIFICATION");
        sendMail(loggedInUser.email, loggedInUser.username, link)
        throw {
          status: 401,
          message: 'Email address has not been verified!',
        };
      }

      const payload = {
        id: loggedInUser.id
      }

      const access_token = signToken(payload)
      res.status(200).json({ access_token, user: await getUser(loggedInUser.id) })
    } catch (err) {
      next(err)
    }
  }

  static async verify(req, res, next) {
    try {
      const { verification } = req.query

      if (!verification) throw {
        status: 401,
        message: 'Invalid Link',
      };

      const payload = verifyToken(verification)
      const theSearchedUser = await User.findByPk(payload.id)

      if (!theSearchedUser) throw {
        status: 401,
        message: 'Invalid Link',
      };

      if (theSearchedUser.verified) throw {
        status: 400,
        message: 'Your email address has been verified',
      };

      await User.update({ verified: true }, {
        where: {
          id: theSearchedUser.id
        }
      });

      const userPayload = {
        id: theSearchedUser.id
      }

      const access_token = signToken(userPayload)
      delete theSearchedUser.dataValues.password
      delete theSearchedUser._previousDataValues.password;
      res.status(200).json({ access_token, user: theSearchedUser, message: `${theSearchedUser.email} has been verified` })
    } catch (err) {
      next(err)
    }
  }

  static async getUser(req, res, next) {
    // try {
      res.status(200).json(req.userInfo)
    // } catch (err) {
    //   next(err)
    // }
  }
}

module.exports = Controller

// vim: sw=2 ts=8 et
