const bcrypt = require('bcryptjs')
const Schema = require('./schema')
const { v4: uuid } = require('uuid')

const { User } = require('./../../models')
const sendMail = require('./../../utils/sendMail')

module.exports = {
    // регистрация
    // /signup (POST)
    async signUp(req, res) {
        const { email, lang } = req.body

        await Schema.lang.validateAsync(lang)
        await Schema.email.validateAsync(email)

        const existedUser = await User.findOne({where: {email}})

        if(existedUser) {
            throw({message: 'Email has already used', type: 'NOT_UNIQUE_EMAIL'})
        }

        let firstLogin = email.split('@')[0]

        let login = firstLogin 

        let notUniqueLogin = await User.findOne({where: {login}})

        let i = 1
        while(notUniqueLogin) {
            login = firstLogin + i
            notUniqueLogin = await User.findOne({where: {login}})
            i++
        } 

        const username = login

        const password = uuid()

        const mailBody = `
        login: ${login}, <br />
        password: ${password}
        `
    
        await sendMail(email, mailBody, 'Sign up')

        const hash = await bcrypt.hash(password, 8)

        const user = await User.create({
            id: uuid(),
            username, 
            email,
            login,
            lang,
            password: hash
        })  
        req.session.userId = user.id

        res.json('OK')
    },
    // авторизация
    // /login (POST)
    async login(req, res, next) {
        const { login, password } = req.body 

        await Schema.password.validateAsync(password)

        let loginType = null

        try {
            await Schema.email.validateAsync(login)
            loginType = 'email'
        } catch(err) {
            loginType = 'login'
        }

        try {
            await Schema.login.validateAsync(login)
        } catch(err) {
            if(loginType === 'login') {
                loginType = null
            }
        }

        if(!loginType) throw({message: 'wrong login'})

        const user = await User.findOne({where: loginType === 'email' ? {email: login} : {login}});
        
        if (!user) {
            throw({message: 'user doesnt exist', statusCode: 401})
        }
              
        const isMatch = await bcrypt.compare(password, user.password)
      
        if (!isMatch) {
            throw({message: 'wrong password', statusCode: 401})
        }
        
        req.session.userId = user.id
        res.json({lang: user.lang})
    },
    // выход
    // /logout (GET)
    async logout(req, res) {
        req.session.destroy()
        res.json('OK')
    },
    // проверить зарегестрирован ли пользователь
    // /authme (GET)
    async authMe(req, res) {
        if(req.session.userId) {
            const user = await User.findByPk(req.session.userId, {attributes: ['id', 'lang']})
            return res.json(user)
        }
        throw({message: 'authme fail', statusCode: 403})
    },
    async changeLang(req, res) {
        await Schema.lang.validateAsync(req.session.lang)

        const result = await User.update({lang: req.body.lang}, {where: {id: req.session.userId}})

        if(!result[0]) {
            throw({message: 'changing lang error', statusCode: 500})
        }

        res.json("OK")
    },
    async recoverPassword(req, res) {
        await Schema.email.validateAsync(req.body.email)

        const password = uuid()

        const hash = await bcrypt.hash(password, 8)

        const result = await User.update({password: hash}, {where: {email: req.body.email}})

        if(!result[0]) {
            throw({message: 'changing lang error', type: 'WRONG_EMAIL', statusCode: 500})
        }

        const mailBody = `new password: ${password}`
    
        await sendMail(req.body.email, mailBody, 'Recover the password')

        res.json("OK")
    }
}