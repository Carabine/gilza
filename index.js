const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
const fileUpload = require('express-fileupload');

require('dotenv').config()

const errorHandler = require('./src/utils/errorsHandler')
const createFolders = require('./src/utils/createFolders')


app.use(cors({
	credentials: true,
	origin: process.env.FRONTEND_URL,
	allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}))

app.keys = ['secret-key']

app.use(
  session({
    name: '_redisPractice',
    store: new RedisStore({ client: redisClient }),
    secret: 'keyboard cat',
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 2 * 30 * 24 * 60 * 60 * 1000}, 
    resave: false  
  }) 
)

app.use(fileUpload({
  limits: { fileSize: process.env.FILE_SIZE_LIMIT},
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

createFolders()

app.use('/static', express.static(process.env.STATIC_PATH))
app.use('/sse/:id', require('./src/api/sse/index'))
app.use('/', require('./src/api/mediafiles/router'))
app.use('/', require('./src/api/auth/router'))
app.use('/', require('./src/api/projects/router'))
app.use('/', require('./src/api/users/router'))
app.use(errorHandler)


app.listen(process.env.PORT, (err) => {
    if(err) {
       return console.log(err)
    }
    console.log('App is listening on port ' + process.env.PORT)
})