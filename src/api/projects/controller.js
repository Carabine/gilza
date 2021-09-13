const { v4: uuid } = require('uuid')
const log4js = require("log4js");

const db = require('./../../models/index').db
const { User, Container, Project, Option, Form, FormItem, Video, Request, Category, ProjectCategory, Estimate } = require('./../../models')
const Schema = require('./schema')
const projectCategories = require('../../models/generated/definition/project-categories')
const categories = require('../../models/generated/definition/categories')
const Sequelize = require('./../../models/index').Sequelize

log4js.configure({
  appenders: { logger: { type: "file", filename: `${process.env.LOGS_PATH}logs.log` } },
  categories: { default: { appenders: ["logger"], level: "info" } }
});
 
const logger = log4js.getLogger("logger");

module.exports = {
    // создать проект
    // /projects (POST)
    async createProject(req, res) {
        await Schema.createProject.validateAsync({name: req.body.name, lang: req.body.lang})

        const project = await Project.create({
            id: uuid(),
            name: req.body.name,
            userId: req.session.userId,
            projectLang: req.body.projectLang,
            created: Date.now()
        })

        console.log(project)

        project.dataValues.estimates = []

        res.json(project)
    },
    // удалить проект
    // /projects (DELETE)
    async deleteProject(req, res) {
        const result = await Project.destroy({where: {id: req.query.projectId, userId: req.session.userId}})

        if(!result) {
            throw({message: 'deleting project error', statusCode: 400})
        }

        res.json('OK')
    },
    // получить список проектов пользователя
    // /projects (GET)
    async getProjectsList(req, res) {
        const options = {
            where: {
                userId: req.session.userId
            },
            include: [
                {
                    model: Container,
                    as: 'containers',
                    limit: 1,
                    attributes: ['videoId']
                },
                {
                    model: Estimate,
                    as: 'estimates',
                    attributes: ['isLike', 'projectId']
                }
            ],
            attributes: ['id', 'name', 'desc', 'created', 'views'],
            order: [['created', 'DESC']]

        }

        const projects = await Project.findAll(options)

        for (let project of projects) {
            if(project.containers[0]) {
                
                const video = await Video.findByPk(project.containers[0].videoId)

                if(video) {
                    project.dataValues.video = video.dataValues
                }
            }
        }
        res.json(projects)
    },
    // получить список контейнеров проекта
    // /projects/:id (GET)
    async getProjectData(req, res) {
        const options = {
            where: {id: req.params.id},
            include: [
                {
                    model: Container,
                    as: 'containers',
                    include: [
                        {
                            model: Option,
                            as: 'options',
                        },
                        {       
                            model: Form,
                            as: 'form',
                            include: [
                                {
                                    model: FormItem,
                                    as: 'formItems'
                                }
                            ]       
                        },
                        {
                            model: Video,
                            as: 'video'
                        }
                    ]
                },
                {
                    model: Category,
                    as: 'categories'
                }
            ],
            order: [[{model: Container, as: 'containers'}, 'created', 'ASC'], [{model: Container, as: 'containers'}, {model: Option, as: 'options'}, 'created', 'ASC']]            
        }
        
        const project = await Project.findOne(options)


        res.json(project)

    },
    // изменить название проекта
    // /projects/:projectId/name (PUT)
    async changeProjectName(req, res) {
        await Schema.projectName.validateAsync(req.body.name)

        const result = await Project.update({name: req.body.name},{where: {id: req.params.projectId, userId: req.session.userId}})

        if(!result[0]) {
            throw({message: 'changing project error', statusCode: 400})
        }

        res.json('OK')
    },
    // изменить проект
    // /projects/:projectId (PUT)
    async editProject(req, res) {
        await Schema.editProject.validateAsync(req.body)

        const result = await Project.update({desc: req.body.desc, isPublic: req.body.isPublic, projectLang: req.body.projectLang},
            {where: {id: req.params.projectId, userId: req.session.userId}})
        
        if(!result[0]) {
            throw({message: 'editing project error', statusCode: 400})
        }

        for(cat of req.body.categories) {
            const category = await Category.findByPk(cat.name)
            if(!category) throw({message: 'Invalid category'})

            await ProjectCategory.create({id: uuid(), projectId: req.params.projectId, categoryName: cat.name})
        }

        res.json('OK')
    },
    // добавить +1 просмотр к проекту
    // /projects/:projectId/views
    async incProjectViews(req, res) {
        try {
            await Project.increment({views: 1}, { where: { id: req.params.projectId }})
        } catch(err) {
            console.log(err)
        }
        res.json('OK')
    },
    // получить контейнер публично
    // /:id (GET)
    async getPublicProject(req, res) {
        const options = {
            where: {id: req.params.id},
            include: [
                {
                    model: Container,
                    as: 'containers',
                    include: [
                        {
                            model: Option,
                            as: 'options',
                        },
                        {       
                            model: Form,
                            as: 'form',
                            include: [
                                {
                                    model: FormItem,
                                    as: 'formItems'
                                }
                            ]       
                        },
                        {
                            model: Video,
                            as: 'video'
                        }
                    ],
                },
                {
                    model: Estimate,
                    as: 'estimates',
                }
                
            ],
            order: [[{model: Container, as: 'containers'}, 'created', 'ASC'], [{model: Container, as: 'containers'}, {model: Option, as: 'options'}, 'created', 'ASC'], [{model: Container, as: 'containers'}, {model: Form, as: 'form'}, {model: FormItem, as: 'formItems'}, 'created', 'ASC']]
        }

        if(req.session.userId) {
            options.include.push({
                model: User,
                as: 'userEstimates',
                where: {id: req.session.userId},
                required: false,
                attributes: ['id']
            })
        }

        const project = await Project.findOne(options)

        if(!project) {
            throw ({message: 'cant find project'})
        } 

        res.json(project)
    },
    // удалить контейнер 
    // /projects/:projectId/containers/:containerId (DELETE)
    async deleteContainer(req, res) {
        console.log(req.params.containerId, req.params.projectId)
        const project = await Project.findOne({where: {id: req.params.projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }
        const result = await Container.destroy({where: {id: req.params.containerId, projectId: project.id}})

        if(!result) {
            throw ({message: 'Wrong containerId', statusCode: 400})
        }

        // меняю ссылки варинтов, которые вели на удаленный контенер, на контейнер, в котором они находятся 
        const options = await Option.findAll({where: {containerLinkId: req.params.containerId}}) 
        await Promise.all(options.map(opt => opt.update({containerLinkId: opt.containerId})))
        
        res.json('OK')
    },
    // создать контейнер
    // /projects/:id/containers (POST)
    async createContainer(req, res) {
        const {name, videoId, videoInsc, formItems, options, callbackType} = req.body
        const projectId = req.params.id
        console.log(req.body)

        await Schema.createContainer.validateAsync({videoId, projectId, videoInsc})

        const project = await Project.findOne({where: {id: projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }
        const video = await Video.findOne({where: {id: videoId, userId: req.session.userId}})
        if(!video) {
            throw ({message: 'Wrong videoId', statusCode: 400})
        }
        
        
        switch(callbackType) {
            case 'formItems': {
                const container = await Container.create({id: uuid(), projectId, name, videoId, videoInsc, callbackType, created: Date.now()})
                if(!container) {
                    throw ({message: 'creating container error'})
                }
                
                await Schema.formItems.validateAsync(formItems)

                const form = await Form.create({id: uuid(), containerId: container.id})
                
                for (let item of formItems) {
                    await FormItem.create({id: uuid(), name: item, formId: form.id, created: Date.now()})
                }
                return res.json('OK')
            }
            case 'options': {
                const container = await Container.create({id: uuid(), projectId, name, videoId, videoInsc, callbackType, created: Date.now()})
                if(!container) {
                    throw ({message: 'creating container error'})
                }
                
                await Schema.options.validateAsync(options)

                container.dataValues.options = []
                for (let opt of options) {
                    const option = await Option.create({id: uuid(), containerId: container.id, containerLinkId: container.id, name: opt, created: Date.now()})
                    if(!option) {
                        throw ({message: 'option creating error'})
                    }
                }
                return res.json('OK')
            }
            case 'empty': {
                const container = await Container.create({id: uuid(), projectId, name, videoId, videoInsc, callbackType, created: Date.now()})
                if(!container) {
                    throw ({message: 'creating container error'})
                }
                
                return res.json('OK')
            }
            default: {
                throw ({message: 'Invalid callback type', statusCode: 400})
            }
        }
    },
    // /projects/:projectId/containers/:containerId/options
    async addContainerOption(req, res) {
        console.log(req.params)
        const project = await Project.findOne({where: {id: req.params.projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }

        const container = await Container.findOne({where: {id: req.params.containerId, projectId: project.id}})
        if(container.id !== req.params.containerId) {
            throw ({message: 'Wrong containerId', statusCode: 400})
        }
        if(container.callbackType !== 'options') {
            throw ({message: 'Container cant have options', statusCode: 400})
        }

        const option = await Option.create({id: uuid(), containerId: container.id, containerLinkId: container.id, name: req.body.name, created: Date.now()})

        if(!option) {
            throw ({message: 'creating option error', statusCode: 400})
        }

        res.json(option)

    },
    // изменить ссылку у варианта
    // /projects/:projectId/containers/:containerId/options (PUT)
    async changeContainerOption(req, res) {
        const project = await Project.findOne({where: {id: req.params.projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }

        const container = await Container.findOne({where: {id: req.params.containerId, projectId: project.id}})
        if(container.id !== req.params.containerId) {
            throw ({message: 'Wrong containerId', statusCode: 400})
        }
        if(container.callbackType !== 'options') {
            throw ({message: 'Container cant have options', statusCode: 400})
        }

        // принадлежит ли пользователю контейнер, на который он хочет, чтобы вел вариант
        const containerLink = await Container.findOne({where: {id: req.body.containerLinkId, projectId: project.id}})
        if(!containerLink) {
            throw ({message: 'Wrong containerLinkId', statusCode: 400})
        }

        const option = await Option.update({containerLinkId: containerLink.id}, {where: {id: req.body.optionId, containerId: container.id}})

        if(!option[0]) {
            throw ({message: 'Wrong optionId'})
        }

        const options = {
            where: {id: req.params.containerId},
            include: [
                {
                    model: Option,
                    as: 'options',
                    order: [
                        ['created', 'DESC'],
                    ]
                },
                {       
                    model: Form,
                    as: 'form',
                    include: [
                        {
                            model: FormItem,
                            as: 'formItems'
                        }
                    ]       
                },
                {
                    model: Video,
                    as: 'video'
                }
            ],
            order: [['created', 'ASC'], [{model: Option, as: 'options'}, 'created', 'ASC']]
        }
        
        // контейнер после изменений
        const currentContainer = await Container.findOne(options)

        currentContainer.dataValues.project = project

        res.json(currentContainer)
    },
    // /projects/:projectId/containers/:containerId/options/:optionId/name
    async changeContainerOptionName(req, res) {
        const project = await Project.findOne({where: {id: req.params.projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }

        const container = await Container.findOne({where: {id: req.params.containerId, projectId: project.id}})
        if(container.id !== req.params.containerId) {
            throw ({message: 'Wrong containerId', statusCode: 400})
        }
        if(container.callbackType !== 'options') {
            throw ({message: 'Container cant have options', statusCode: 400})
        }

        const option = await Option.update({name: req.body.name}, {where: {id: req.params.optionId, containerId: container.id}})

        if(!option[0]) {
            throw ({message: 'Wrong optionId'})
        }


        res.json("OK")
    },
    // получить данные контейнера
    // /projects/:projectId/containers/:containerId
    async getContainerData(req, res) {
        const project = await Project.findOne({where: {id: req.params.projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'cant find project'})
        } 
        const options = {
            where: {projectId: project.id, id: req.params.containerId},
            include: [
                {
                    model: Option,
                    as: 'options',
                },
                {       
                    model: Form,
                    as: 'form',
                    include: [
                        {
                            model: FormItem,
                            as: 'formItems'
                        }
                    ]       
                },
            ],
            order: [['created', 'ASC'], [{model: Option, as: 'options'}, 'created', 'ASC'], [{model: Form, as: 'form'}, {model: FormItem, as: 'formItems'}, 'created', 'ASC']]
        }
        
        const container = await Container.findOne(options)

        const video = await Video.findByPk(container.videoId)
        container.dataValues.video = video
        
        res.json(container)
    },
    // редактирование контейнера
    // /projects/:projectId/containers/:containerId (PUT)
    async editContainer(req, res) {
        const {name, videoId, videoInsc, formItems, options, callbackType} = req.body
        const projectId = req.params.projectId
        const containerId = req.params.containerId

        console.log(req.body)
        console.log(req.params)

        await Schema.editContainer.validateAsync({videoId, projectId, containerId})

        const project = await Project.findOne({where: {id: projectId, userId: req.session.userId}})
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }

        const video = await Video.findOne({where: {id: videoId, userId: req.session.userId}})
        if(!video) {
            throw ({message: 'Wrong videoId', statusCode: 400})
        }

        const oldContainer = await Container.findOne({where: {id: req.params.containerId, projectId: project.id}})
        console.log(videoInsc)
        const container = await oldContainer.update({videoId, videoInsc, name})
        
        if(!container) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }

        if(container.callbackType !== callbackType) {
            throw ({message: 'Wrong callbackType', statusCode: 400})
        }

        switch(callbackType) {
            case 'formItems': {
                const form = await Form.findOne({where: {containerId: container.id}})
                container.dataValues.form = form
                if(!form) {
                    throw ({message: 'Cant find form', statusCode: 400})
                }

                const result = await FormItem.destroy({where: {formId: form.id}})  
                if(!result) {
                    throw ({message: 'Deleting formItems error', statusCode: 400})
                }

                container.dataValues.form.dataValues.formItems = []

                for (let item of formItems) {
                    const formItem = await FormItem.create({id: uuid(), name: item.name, formId: form.id, created: Date.now()})
                    container.dataValues.form.dataValues.formItems.push(formItem)
                }
                return res.json('OK')
            }
            case 'options': {
                await Option.destroy({where: {containerId: container.id}}) 
                container.dataValues.options = []
                for (let opt of options) {
                    if(opt.containerLinkId) {
                        const containerLink = await Container.findOne({where: {id: opt.containerLinkId, projectId: project.id}})
                        if(!containerLink) {
                            throw ({message: 'Wrong containerLinkId', statusCode: 400})
                        }
                    }
                    console.log(Date.now())
                    const option = await Option.create({id: uuid(), containerId: container.id, containerLinkId: opt.containerLinkId ? opt.containerLinkId : container.id, name: opt.name, created: Date.now()})
                    if(!option) {
                        throw ({message: 'option creating error'})
                    }

                    console.log(container.dataValues)
                    container.dataValues.options.push(option)
                }
                return res.json('OK')
            }
            case 'empty': {
                return res.json('OK')
            }
            default: {
                throw ({message: 'Invalid callback type', statusCode: 400})
            }
        }
    },
    // отправить заявку из формы в контейнере
    // /project/:projectId/containers/:containerId/requests (POST)
    async sendRequest(req, res) {
        const project = await Project.findOne({
            where: {id: req.params.projectId},
            include: [
                {
                    model: Container,
                    as: 'container',
                    where: {id: req.params.containerId},
                    include: [
                        {
                            model: Form,
                            as: 'form',
                            include: [
                                {
                                    model: FormItem,
                                    as: 'formItems'
                                }
                            ]
                        }
                    ]
                } 
            ],
            order: [[{model: Container, as: 'container'}, {model: Form, as: 'form'}, {model: FormItem, as: 'formItems'}, 'created', 'ASC']]
        })
        if(!project) {
            throw ({message: 'Wrong projectId', statusCode: 400})
        }
        console.log(project.dataValues)
        const user = await User.findByPk(project.userId)
        if(!user) {
            throw ({message: 'Cant find user', statusCode: 400})
        }

        if(!project.container.form) {
            throw ({message: 'There isnt form in the container', statusCode: 400})
        }

        const correctFields = {}

        console.log(project.container.form.formItems)
        console.log(req.body.formItems)
        
        for (let clientFormItem of req.body.formItems) {
            for(let dbFormItem of project.container.form.formItems) {
                if(clientFormItem.id === dbFormItem.id && clientFormItem.name === dbFormItem.name && clientFormItem.value) {
                    correctFields[clientFormItem.name] = clientFormItem.value
                }
            }
        }

        if(Object.keys(correctFields).length === 0) {
            throw ({message: 'There aren\'t fields or incorrect fields name/id', statusCode: 400})
        }

        await Request.create({id: uuid(), body: correctFields, userId: project.userId, created: Date.now()})
        
        return res.json('OK')
    },
    // получить список заявок пользователя
    // /requests (GET)
    async getRequests(req, res) {
        const requests = await Request.findAll({where: {userId: req.session.userId}, order: [['created', 'DESC']]})

        return res.json(requests)
    },
    // получить первое видео в проекте
    // /projects/:projectId/video (GET)
    async getFirstProjectVideo(req, res) {
        const project = await Project.findByPk(req.params.projectId, {
            include: [
                {
                    model: Container,
                    as: 'containers',
                    attributes: ['videoId'],
                },
            ],
            order: [[{model: Container, as: 'containers'}, 'created', 'ASC']]
        })

        const video = await Video.findByPk(project.containers[0].videoId)

        res.json(video)
    }, 
    // получить список всех проектов для главной страницы
    // /publicProjects (GET)
    async getPublicProjects(req, res) {
        await Schema.lang.validateAsync(req.query.lang)
        await Schema.orderBy.validateAsync(req.query.orderBy)
        await Schema.sortByTime.validateAsync(req.query.sortByTime)


        let time

        if(req.query.sortByTime === 'week') {
            time = Date.now() - 604800000
        } else if(req.query.sortByTime === 'month') {
            time = Date.now() - 2419200000
        } else {
            time = 0
        }

        let order 

        if(req.query.orderBy === 'views') {
            order = [['views', 'DESC']]
        } else if(req.query.orderBy === 'date') {
            order = [['created', 'DESC']]
        } else if(req.query.orderBy === 'rating') {
            order = [[Sequelize.literal('likes_count DESC')]]
        }

        

        const options = {
            where: { isPublic: true, projectLang: req.query.lang, created: { [Sequelize.Op.gte]: time }},
            attributes: { 
                include: ['Project.*',
                [Sequelize.literal('(SELECT COUNT(id) FROM estimates WHERE "estimates"."project_id" = "Project"."id" AND "estimates"."is_like" = \'true\')'), 'likes_count'],
                ] 
            },
            include: [
                {
                    model: Category,
                    as: 'categories',
                    where: req.query.category ? {name: req.query.category} : null
                },
                {
                    model: Container,
                    as: 'containers',
                    attributes: ['id', 'projectId']
                },
                {
                    model: Estimate,
                    as: 'estimates',
                }
            ],
            order: order,
        }

        if(req.session.userId) {
            options.include.push({
                model: User,
                as: 'userEstimates',
                where: {id: req.session.userId},
                required: false,
                attributes: ['id']
            })
        }

        
        // проекты без offset и limit
        const projects2 = await Project.findAll(options) 

        
        const projects = projects2.splice(req.query.offset, req.query.limit)

 
        const projectsForCount = await Project.findAll({
            where: { isPublic: true, projectLang: req.query.lang},
            attributes: ['id'],
            include: [
                {
                    model: Category,
                    as: 'categories',
                    where: req.query.category ? {name: req.query.category} : null
                },
            ],
        })

        const count = projectsForCount.length
        
        if(!projects) {
            return res.json(null)
        }

        for (const item of projects) {
            const user = await User.findByPk(item.userId)
            item.dataValues.user = {username: user.username, userId: user.id, login: user.login, avatar: user.avatar}
        }


        res.json({projects, count})
    },
    // /projects/:projectId/estimate (POST)
    async estimateProject(req, res) {
        await Schema.estimateProject.validateAsync({projectId: req.params.projectId, isLike: req.body.isLike})

        const project = await Project.findByPk(req.params.projectId)
        if(!project) {
            throw({message: 'Wrong projectId'})
        }

        const existedEstimate = await Estimate.findOne({where: {userId: req.session.userId, projectId: req.params.projectId}})

        if(existedEstimate) {
            if(existedEstimate.isLike === req.body.isLike) {
                await existedEstimate.destroy()
            } else {
                await existedEstimate.update({isLike: req.body.isLike})
            }
        } else {
            await Estimate.create({id: uuid(), userId: req.session.userId, projectId: req.params.projectId, isLike: req.body.isLike})
        }

        const updateProject = await Project.findByPk(req.params.projectId, {
            include: [
                {
                    model: User,
                    as: 'userEstimates',
                    where: {id: req.session.userId},
                    required: false,
                    attributes: ['id']
                },
                {
                    model: Estimate,
                    as: 'estimates'
                }
            ]
        }) 

        res.json(updateProject)
    },
    // получить логин, описание и название проекта по id проекта для title
    // /projects/:projectId/meta
    async getProjectMeta(req, res) {
        const project = await Project.findOne({where: {id: req.params.projectId}, attributes: ['id', 'name', 'userId', 'desc']})

        const user = await User.findOne({where: {id: project.userId}, attributes: ['id', 'login']})

        res.json({name: project.name, login: user.login, desc: project.desc})
    },
    async getProjectInfo(req, res) {
        const options = {
            where: {id: req.params.projectId},
            attributes: { 
                include: ['Project.*',
                [Sequelize.literal('(SELECT COUNT(id) FROM estimates WHERE "estimates"."project_id" = "Project"."id" AND "estimates"."is_like" = \'true\')'), 'likes_count'],
                ] 
            },
            include: [
                {
                    model: Estimate,
                    as: 'estimates',
                }
            ]
        }

        if(req.session.userId) {
            options.include.push({
                model: User,
                as: 'userEstimates',
                where: {id: req.session.userId},
                required: false,
                attributes: ['id']
            })
        }
    


        const project = await Project.findOne(options)

        const user = await User.findOne({where: {id: project.userId}})
        
        res.json({project, user})
    },
    async saveToLogs(req, res) {
        console.log(req.body.message)
        logger.error(req.body.message)
        res.json('OK')
    }

}