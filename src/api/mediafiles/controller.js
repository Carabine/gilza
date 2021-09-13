const { v4: uuid } = require('uuid')
const fs = require('fs')
const { promisify } = require('util')
const EventSource = require('eventsource')
const axios = require('axios')

const { Video, MediaServer } = require('./../../models')
const eventEmitter = require('./../../utils/event')
const Schema = require('./schema')



const log4js = require("log4js");
log4js.configure({
  appenders: { logger: { type: "file", filename: `${process.env.LOGS_PATH}logs.log` } },
  categories: { default: { appenders: ["logger"], level: "info" } }
});
 
const logger = log4js.getLogger("logger")


module.exports = {
    // сохранение видеофайла в бд 
    // /mediafiles (POST)
    async saveMediafiles(req, res) { 
        res.connection.setTimeout(Number(process.env.CONNECTION_TIMEOUT))

        const video = await Video.create({id: uuid(), created: Date.now(), size: req.body.size, fileName: req.body.fileName, name: req.body.name, 
                                         userId: req.session.userId, preview: req.body.preview, domain: req.body.domain})
       
        res.json(video)
    },
    // получить список медиафайлов пользователя из бд
    // /mediafiles (GET)
    async getAllMediafiles(req, res) {
        const videos = await Video.findAll({where: {userId: req.session.userId}, order: [['created', 'DESC']]})
        res.json(videos)
    },
    //удалить медиафайл пользователя по айди
    // /mediafiles (DELETE)
    async deleteMediafile(req, res) { 
        const video = await Video.findOne({where: {id: req.query.videoId, userId: req.session.userId}})        

        if(!video) {
            throw({message: 'deleting video error', statusCode: 400})
        }

        await video.destroy()

        try {
            await axios.delete(`${process.env.PROTOCOL}://${video.domain}/mediafiles`, {params: {fileName: video.fileName, preview: video.preview, password: process.env.MEDIA_SERVICE_PASSWORD}})
        } catch(err) {

        }
        
        res.json('OK')
    },
    async changeMediafileName(req, res) {
        console.log(req.body.name)
        console.log(req.params.mediafileId)

        await Schema.videoName.validateAsync(req.body.name)
        
        const result = await Video.update({name: req.body.name}, {where: {id: req.params.mediafileId, userId: req.session.userId}})
        if(!result[0]) {
            throw({message: 'changing video error', statusCode: 400})
        }

        res.json('OK')
    },
    async getMediaserver(req, res) {
        let mediaServer = await MediaServer.findOne({where: {isActive: true, isFull: null}})

        // если не найдено ни одного активного сервера - сделать активным первый незаполненный сервер
        if(!mediaServer) {
            const mediaServer2 = await MediaServer.findOne({where: {isFull: null}})
            if(!mediaServer2) {
                throw({message: 'Cant find not full servers'})
            } 
            await mediaServer2.update({isActive: true})

            mediaServer = mediaServer2
        }

        // текущему серверу установить isActive: false и случайному серверу установить isActive: true
        await mediaServer.update({isActive: false})

        const mediaServers = await MediaServer.findAll({where: {isFull: null}}) 
        const randomServer = mediaServers[Math.floor(Math.random() * (mediaServers.length - 0) + 0)]

        await MediaServer.update({isActive: true}, {where: {domain: randomServer.domain}})

        res.json(mediaServer)
    }
}