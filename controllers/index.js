const { Friendship, Group, Groupmember, Language, Media, Message, Schedule, User, Userlanguage, Userschedule } = require('../models')
const { verifyHash } = require('../helpers/bcryptjs')
const { signToken } = require('../helpers/jwt')

class Controller {

    // USERS
    // register

    static async register (req, res, next) {
        try {
            // Avatar ID belum ada
            const {username, email, password, country, phoneNumber} = req.body

           const newUser = await User.create({username, email, password, country, phoneNumber})

           delete newUser.dataValues.password

           // kirim verification link pakai nodemailer
           
           res.status(201).json(newUser)
        } catch (err) {
            next(err)
        }
    }

    static async login (req, res, next) {
        try {
            const {email, password} = req.body

            if(!email) throw ('Email is required')
            if(!password) throw ('Password is required')

            const loggedInUser = await User.findOne({where: {email}})
            if(!loggedInUser) throw ('Invalid email/password')

            const isValidPassword = verifyHash(password, loggedInUser.password)
            if(!isValidPassword) throw ('Invalid email/password')

            const payload = {
                id: loggedInUser.id
            }

            const access_token = signToken(payload)

            res.status(200).json({access_token})
        } catch(err) {
            next(err)
        }
    }

   
}

module.exports = Controller