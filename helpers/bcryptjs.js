const bcrypt = require('bcryptjs')

const generateHash = (payload) => {
    return bcrypt.hashSync(payload, 8)
}

const verifyHash = (payload, hash) => {
    return bcrypt.compareSync(payload, hash)
}

module.exports = {
    generateHash,
    verifyHash
}