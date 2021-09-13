const eventEmitter = require('../../utils/event')

module.exports = (req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/event-stream')

    // отвечает за то, чтобы оповещать пользователя, после загрузки каждого видео
    eventEmitter.on('videoHasUploaded:' + req.params.id, (data) => {
        res.write(`data: ${JSON.stringify(data.video)}\nevent:videoHasUploaded:${req.params.id}\n\n`)
    })

    // отвечает за то, чтобы отправлять процент загрузки после каждого события data в потоке
    eventEmitter.on('progressVideoData:' + req.params.id, (data) => {
        res.write(`data: ${JSON.stringify(data)}\nevent:progressVideoData:${req.params.id}\n\n`)
    })
}