const router = require('express').Router()
const { authentication } = require('../middlewares/authentication')

const userRouter = require('../routes/userRouter')





router.use('/users', userRouter)

router.use(authentication)

router.post("/avatar", async (req, res, next) => {});

router.get("/messages/:groupId", async (req, res, next) => {});

router.post("/messages/:groupId", ,async (req, res, next) => {});




module.exports = router
