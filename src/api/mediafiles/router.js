const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const MediafilesController = require('./controller')
const authMiddleware = require('./../middlewares/auth')

router.post('/mediafiles', authMiddleware, asyncHandler(MediafilesController.saveMediafiles))
router.get('/mediafiles', authMiddleware, asyncHandler(MediafilesController.getAllMediafiles))
router.delete('/mediafiles', authMiddleware, asyncHandler(MediafilesController.deleteMediafile))
router.put('/mediafiles/:mediafileId', authMiddleware, asyncHandler(MediafilesController.changeMediafileName))
router.get('/mediaserver', authMiddleware, asyncHandler(MediafilesController.getMediaserver))


module.exports = router