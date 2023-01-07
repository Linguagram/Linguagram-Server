const router = require('express').Router()
const Controller = require('../controllers')


router.post('/users/register', Controller.register)

router.post('/users/login', Controller.login)

router.post('/users/verify', Controller.verify)



module.exports = router
