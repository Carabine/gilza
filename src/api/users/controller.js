const { v4: uuid } = require('uuid')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const { promisify } = require('util')
const spawn = require('child_process').spawn
const sharp = require('sharp');

const db = require('./../../models/index').db
const { User, Container, Project, Estimate } = require('./../../models')
const Schema = require('./schema')
const { password } = require('./schema')

const log4js = require("log4js");
log4js.configure({
  appenders: { logger: { type: "file", filename: `${process.env.LOGS_PATH}logs.log` } },
  categories: { default: { appenders: ["logger"], level: "info" } }
});
 
const logger = log4js.getLogger("logger")


module.exports = {
    // /users/:login (GET)
    async getPublicUserData(req, res) {
        console.log(req.query.limit)

        const options = {
            include: [
                {
                    model: Container,
                    as: 'containers',
                    attributes: ['id']
                },
                {
                    model: User,
                    as: 'user',
                    where: { login: req.params.login },
                    attributes: ['login', 'avatar']
                },
                {
                    model: Estimate,
                    as: 'estimates'
                }
            ],
            offset: req.query.offset,
            limit: req.query.limit,
            order: [['created', 'DESC']]
        }

        if (req.session.userId) {
            options.include.push({
                model: User,
                as: 'userEstimates',
                where: { id: req.session.userId },
                required: false,
                attributes: ['id']
            })
        }

        const projects = await Project.findAll(options)

        const user = await User.findOne({
            where: { login: req.params.login },
        })

        if (!user) {
            throw ({ message: 'can\'t find user', statusCode: 400 })
        }

        const count = await Project.count({
            include: [
                {
                    model: User,
                    as: 'user',
                    where: { login: req.params.login }
                }
            ]
        })

        res.json({ user, projects, count })
    },
    // /settings (GET)
    async getSettings(req, res) {
        const user = await User.findOne({ where: { id: req.session.userId }, attributes: ['username', 'email', 'about', 'login', 'avatar'] })

        res.json(user)
    },
    // /settings/general (PUT)
    async changeGeneralSettings(req, res) {
        await Schema.generalSettings.validateAsync(req.body)

        const isLoginNotUnique = await User.findOne({ where: { login: req.body.login } })

        if (isLoginNotUnique && isLoginNotUnique.id !== req.session.userId) throw ({ message: 'Not unique login', type: 'NOT_UNIQUE_LOGIN', statusCode: 400 })

        const isEmailNotUnique = await User.findOne({ where: { email: req.body.email } })

        if (isEmailNotUnique && isEmailNotUnique.id !== req.session.userId) throw ({ message: 'Not unique email', type: 'NOT_UNIQUE_EMAIL', statusCode: 400 })

        const result = await User.update({ username: req.body.username, login: req.body.login, email: req.body.email, about: req.body.about }, { where: { id: req.session.userId } })

        if (!result[0]) {
            throw ({ message: 'Can\'t find user to update general settings' })
        }

        res.json('OK')
    },
    // /settings/security (PUT)
    async changeSecuritySettings(req, res) {
        await Schema.password.validateAsync(req.body.password)

        const hash = await bcrypt.hash(req.body.password, 8)

        const result = await User.update({ password: hash }, { where: { id: req.session.userId } })

        if (!result[0]) {
            throw ({ message: 'can\'t find user to update secutiry settings' })
        }
        res.json('OK')
    },
    // /settings/avatar (PUT)
    async changeAvatar(req, res) {
        const writeFileAsync = promisify(fs.writeFile)
        const deleteFileAsync = promisify(fs.unlink);

        if (req.files[0].mimetype.split('/')[0] !== 'image') {    
            throw ({ message: 'wrong file type' })
        }
        
        const extension = 'jpg'
        const fileName = Date.now() + '_' + uuid() + '.' + extension

        await writeFileAsync(process.env.UPLOADS_PATH + fileName, req.files[0].data)

        await sharp(process.env.UPLOADS_PATH + fileName).resize({
            width: 100,
            height: 100
        }).toFile(process.env.AVATARS_PATH + fileName)


        const user = await User.findByPk(req.session.userId)

        if(user.avatar) {
            try {
                await deleteFileAsync(process.env.AVATARS_PATH + user.avatar)
            } catch(err) {
                console.log('WARNING: cant delete avatar')
            }
        }

        await user.update({avatar: fileName})

        res.json(fileName)
    },
    // /profile (GET)
    async getProfileData(req, res) {
        const user = await User.findOne({
            where: { id: req.session.userId },
            attributes: ['login', 'username', 'avatar']
        })

        res.json(user)
    }
}