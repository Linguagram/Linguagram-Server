const bcrypt = require('bcryptjs')

const generateHashedPassword = (pwd) => {
    return bcrypt.hashSync(pwd, 8)
}

const verifyPassword = (pwd, hashedPwd) => {
    return bcrypt.compareSync(pwd, hashedPwd)
}

module.exports = {
    generateHashedPassword, 
    verifyPassword
}