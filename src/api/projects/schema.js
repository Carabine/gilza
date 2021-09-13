const Joi = require('@hapi/joi')

module.exports = {
    createProject: Joi.object({
        name: Joi.string().min(1).max(320).required(),
    }).options({ stripUnknown: true }),
    createContainer: Joi.object({
        videoId: Joi.string().guid({ version: ['uuidv4']}).required(),
        projectId: Joi.string().guid({ version: ['uuidv4']}).required(),
        videoInsc: Joi.string().max(200).allow(""),
    }).options({ stripUnknown: true }),
    options: Joi.array().items(Joi.string().min(1).max(200).required()).required(),
    formItems: Joi.array().items(Joi.string().min(1).max(200).required()).required(),
    requests: Joi.array().items(Joi.object().required()).required(),
    editContainer: Joi.object({
        videoId: Joi.string().guid({ version: ['uuidv4']}).required(),
        projectId: Joi.string().guid({ version: ['uuidv4']}).required(),
        containerId: Joi.string().guid({ version: ['uuidv4']}).required(),
    }),
    projectName: Joi.string().min(1).max(320).required(),
    editProject: Joi.object({
        isPublic: Joi.boolean().required(),
        desc: Joi.string().max(200).allow('').optional(),
        categories: Joi.array().items(Joi.object().keys({
            name: Joi.string().required()
        })).max(5),
        projectLang: Joi.string().valid('en', 'ru')
    }).options({ stripUnknown: true }),
    lang: Joi.string().valid('en', 'ru'),
    estimateProject: Joi.object({
        isLike: Joi.boolean().required(),
        projectId: Joi.string().guid({ version: ['uuidv4']}).required()
    }).options({ stripUnknown: true }),
    orderBy: Joi.string().valid('rating', 'views', 'date'),
    sortByTime: Joi.string().valid('week', 'month', 'allTime')
}