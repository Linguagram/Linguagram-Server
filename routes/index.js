const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const userRouter = require('../routes/userRouter')





router.use('/users', userRouter)

router.use(authentication)





module.exports = router