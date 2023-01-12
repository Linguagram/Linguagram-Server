const { verifyToken } = require('../helpers/jwt')
const { User, Media } = require('../models')
const { userFetchAttributes } = require('../util/fetchAttributes')


const authentication = async(req, res, next) => {
  try {
    const {access_token} = req.headers
    if(!access_token) throw {
      status: 401,
      message: 'Invalid Token',
    };

    const payload = verifyToken(access_token)

    const theSearchedUser = await User.findByPk(payload.id, userFetchAttributes(Media));

    if(!theSearchedUser) throw {
      status: 401,
      message: 'Invalid Token',
    };

    req.userInfo = theSearchedUser;

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
    authentication
}
