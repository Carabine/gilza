const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const UsersController = require('./controller')
const authMiddleware = require('./../middlewares/auth')

router.get('/users/:login', asyncHandler(UsersController.getPublicUserData))

router.get('/settings', authMiddleware, asyncHandler(UsersController.getSettings))
router.put('/settings/general', authMiddleware, asyncHandler(UsersController.changeGeneralSettings))
router.put('/settings/security', authMiddleware, asyncHandler(UsersController.changeSecuritySettings))
router.put('/settings/avatar', authMiddleware, asyncHandler(UsersController.changeAvatar))

// минимальные данные о пользователе для хеадера
router.get('/profile', authMiddleware, asyncHandler(UsersController.getProfileData))

module.exports = router