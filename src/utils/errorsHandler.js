const log4js = require("log4js");
log4js.configure({
  appenders: { logger: { type: "file", filename: `${process.env.LOGS_PATH}logs.log` } },
  categories: { default: { appenders: ["logger"], level: "info" } }
});
 
const logger = log4js.getLogger("logger");

module.exports = (err, req, res, next) => {
    // обрабатывает все throw
    err.status = err.statusCode || err.status || 500
    res.statusCode = err.status
    res.json({message: 'Something went wrong', type: err.type})
    logger.error(err.message)
    if(process.env.MODE === 'dev') {
        console.log('')
        console.log('***********ERROR*************')
        console.log()
        console.log(' ' + err.message)
        console.log()
        console.log('*****************************')
    }
    // if(process.env.MODE === 'dev') throw new Error(err.message) 
}