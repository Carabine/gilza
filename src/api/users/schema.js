const Joi = require('@hapi/joi')

module.exports = {
    generalSettings: Joi.object({
        username: Joi.string().min(1).max(320),
        login: Joi.string().regex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))$/i).min(1).max(200).required(),
        email: Joi.string().regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).required(),
    }).options({ stripUnknown: true }),
    password: Joi.string().min(1).max(320)
}