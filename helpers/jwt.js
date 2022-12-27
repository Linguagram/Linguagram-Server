const jwt = require('jsonwebtoken')


const signToken = (payload) => {
    return jwt.sign(payload, 'pakeDOTenv')
}

const verifyToken = (token) => {
    return jwt.verify(token, 'pakeDOTenv')
}

module.exports = {
    signToken,
    verifyToken
}