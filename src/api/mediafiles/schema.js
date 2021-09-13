const Joi = require('@hapi/joi')

module.exports = {
    videoName: Joi.string().min(1).max(320).required()
}