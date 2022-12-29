"use strict";

const {
  Friendship,
  Group,
  Groupmember,
  Language,
  Media,
  Message,
  Schedule,
  User,
  UserLanguage,
  UserSchedule,
  sequelize,
} = require('../models')

const { generateHash, verifyHash } = require('../helpers/bcryptjs')
const { signToken, verifyToken } = require('../helpers/jwt')
const { sendMail } = require('../helpers/nodemailer');
const { userFetchAttributes } = require('../util/fetchAttributes');

class Controller {

  // USERS
  // register

  static async register (req, res, next) {
    try {
      // Avatar ID belum ada
      const {
	username,
	email,
	password,
	country,
	phoneNumber,
	// Dipisah atau jadi satu array?
	nativeLanguages = [],
	interestLanguages = [],
      } = req.body

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
	];

	const newUserLanguages = await UserLanguage.bulkCreate(createUserLanguages, {
	  transaction: t,
	});
      });

      const opts = userFetchAttributes(Media);
      opts.include.push(
	{
	  model: UserLanguage,
	  include: [Language],
	}
      );

      const newUser = await User.findByPk(createdUser.id, opts);

      console.log(newUser);

      const verificationId = signToken(newUser.id)
      const link = `http://localhost:3000/users/verify?verification=${verificationId}`
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

  static async login (req, res, next) {
    try {
      const {email, password} = req.body

      if(!email) throw {
	status: 400,
	message: 'Email is required',
      };

      if(!password) throw {
	status: 400,
	message: 'Password is required',
      };

      const loggedInUser = await User.findOne({where: {email}})
      if(!loggedInUser) throw {
	status: 401,
	message: 'Invalid email/password',
      };

      const isValidPassword = verifyHash(password, loggedInUser.password)
      if(!isValidPassword) throw {
	status: 401,
	message: 'Invalid email/password',
      };

      if(!loggedInUser.verified) {
	const verificationId = signToken(loggedInUser.id)
	const link = `http://localhost:3000/users/verify?verification=${verificationId}`
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

      res.status(200).json({access_token})
    } catch(err) {
      next(err)
    }
  }

  static async verify (req, res, next) {
    try {
      const { verification } = req.query

      const id = verifyToken(verification)

      const theSearchedUser = await User.findByPk(id)
      if(!theSearchedUser) throw {
	status: 401,
	message: 'Invalid Link',
      };

      if(theSearchedUser.verified) throw {
	status: 400,
	message: 'Your email address has been verified',
      };

      await User.update({ verified: true }, {
	where: {
	  id: theSearchedUser.id
	}
      });

      res.status(200).json({message: `${theSearchedUser.email} has been verified`})

    } catch(err) {
      next(err)
    }
  }


}

module.exports = Controller
