const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')


const authentication = async(req, res, next) => {
    try {
        const {access_token} = req.headers
        if(!access_token) throw('Invalid token')

        const payload = verifyToken(access_token)

        const theSearchedUser = await User.findByPk(payload.id)
        if(!theSearchedUser) throw ('Invalid token')

        req.userInfo = {
            id: theSearchedUser.id,
        }

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = {
    authentication
}