const fs = require('fs')

const createFolders = () => {
    if (!fs.existsSync(process.env.STATIC_PATH)) {
        console.log('CREATING STATIC FOLDER');
        fs.mkdirSync(process.env.STATIC_PATH);
    }
    if (!fs.existsSync(process.env.AVATARS_PATH)) {
        console.log('CREATING AVATARS FOLDER');
        fs.mkdirSync(process.env.AVATARS_PATH);
    }
    if (!fs.existsSync(process.env.UPLOADS_PATH)) {
        console.log('CREATING UPLOADS FOLDER');
        fs.mkdirSync(process.env.UPLOADS_PATH);
    }

}

module.exports = createFolders