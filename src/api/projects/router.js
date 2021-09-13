const express = require('express')
const router = express.Router()
const asyncHandler = require('express-async-handler')

const ProjectsController = require('./controller')
const authMiddleware = require('./../middlewares/auth')


router.post('/projects', authMiddleware, asyncHandler(ProjectsController.createProject))
router.delete('/projects', authMiddleware, asyncHandler(ProjectsController.deleteProject))
router.get('/projects', authMiddleware, asyncHandler(ProjectsController.getProjectsList))
router.get('/projects/:id', authMiddleware, asyncHandler(ProjectsController.getProjectData))
router.put('/projects/:projectId/name', authMiddleware, asyncHandler(ProjectsController.changeProjectName))
router.put('/projects/:projectId', authMiddleware, asyncHandler(ProjectsController.editProject))
router.post('/projects/:projectId/views', asyncHandler(ProjectsController.incProjectViews))


router.delete('/projects/:projectId/containers/:containerId', authMiddleware, asyncHandler(ProjectsController.deleteContainer))
router.post('/projects/:id/containers', authMiddleware, asyncHandler(ProjectsController.createContainer))
router.get('/projects/:projectId/containers/:containerId', authMiddleware, asyncHandler(ProjectsController.getContainerData))
router.put('/projects/:projectId/containers/:containerId', authMiddleware, asyncHandler(ProjectsController.editContainer))

router.post('/projects/:projectId/containers/:containerId/options', authMiddleware, asyncHandler(ProjectsController.addContainerOption))
router.put('/projects/:projectId/containers/:containerId/options', authMiddleware, asyncHandler(ProjectsController.changeContainerOption))
router.put('/projects/:projectId/containers/:containerId/options/:optionId/name', authMiddleware, asyncHandler(ProjectsController.changeContainerOptionName))

router.post('/projects/:projectId/containers/:containerId/requests', asyncHandler(ProjectsController.sendRequest))
router.get('/requests', authMiddleware, asyncHandler(ProjectsController.getRequests))

router.get('/publicProjects/:id', asyncHandler(ProjectsController.getPublicProject)) // публичная ссылка
router.get('/publicProjects', asyncHandler(ProjectsController.getPublicProjects))

router.get('/projects/:projectId/video', asyncHandler(ProjectsController.getFirstProjectVideo)) // получить первое видео в проекте для превью виджета

router.post('/projects/:projectId/estimate', authMiddleware, asyncHandler(ProjectsController.estimateProject))

router.get('/projects/:projectId/meta', asyncHandler(ProjectsController.getProjectMeta))
router.get('/projects/:projectId/info', asyncHandler(ProjectsController.getProjectInfo))

router.post('/logs', ProjectsController.saveToLogs)



module.exports = router