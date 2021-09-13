const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const AuthController = require('./controller')
const authMiddleware = require('./../middlewares/auth')


router.post('/signup', asyncHandler(AuthController.signUp));
router.post('/login', asyncHandler(AuthController.login));
router.get('/logout', asyncHandler(AuthController.logout));
router.get('/authme', asyncHandler(AuthController.authMe));
router.post('/lang', authMiddleware, asyncHandler(AuthController.changeLang));
router.post('/password', asyncHandler(AuthController.recoverPassword));




module.exports = router