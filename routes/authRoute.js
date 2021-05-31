var express = require('express')
var router = express.Router()

const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
router.post('/googlelogin', authController.gooleLogin)
router.put('/setpassword', authMiddleware.authMiddleware, authController.setPassword)
router.post('/login',authController.Login)
module.exports = router