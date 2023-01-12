"use strict";

const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = process.env;

const signToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET_KEY)
}

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET_KEY)
}

module.exports = {
    signToken,
    verifyToken
}
