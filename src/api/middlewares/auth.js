module.exports = (req, res, next) => {
    if(req.session.userId) {
       return next()
       // дальше вызываются роуты, к которым должен быть доступ у только зарегистрированнного пользователя
    } 
    

    throw({message: 'empty session id', statusCode: 403})
}