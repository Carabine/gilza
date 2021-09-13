const Joi = require('@hapi/joi')

module.exports = {
    email: Joi.string().regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).required(),
    login: Joi.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/i).min(1).max(200).required(),
    password: Joi.string().min(1).max(200).required(),
    lang: Joi.string().valid('en', 'ru')
}