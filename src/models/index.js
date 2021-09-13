const Sequelize = require('sequelize') 

const cls = require('cls-hooked')
const namespace = cls.createNamespace('default-backend-ns')
Sequelize.useCLS(namespace)

const db = new Sequelize(process.env.DATABASE_URL, {
    // define: {
    //     hooks: {
    //         beforeCount: function (options) {
    //             if (this._scope.include && this._scope.include.length > 0) {
    //               options.distinct = true
    //               options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
    //             }
              
    //             if (options.include && options.include.length > 0) {
    //               options.include = null
    //             }
    //         }
    //     }
    // },
    //logging: process.env.SEQUELIZE_LOGGING ? console.log : false,
    underscored: false, 
    pool: { 
        max: parseInt(process.env.POOL_MAX), 
        min: parseInt(process.env.POOL_MIN), 
        acquire: parseInt(process.env.POOL_ACQUIRE), 
        idle: parseInt(process.env.POOL_IDLE),
        timezone: process.env.TIMEZONE || '+00:00'
    }
})

const models = require('./generated').init(db)

const initRelations = require('./relations')
initRelations(models) 




const addCategoriesToDB = async () => {
    const categories = ['transport', 'music', 'animals', 'sport', 'travels', 'games', 'peopleAndBlogs', 'humor', 'entertainment', 
                        'newsAndPolitics', 'hobbyAndStyle', 'education', 'scienceAndTechnology', 'businessAndFinances']

    try {
        for(category of categories) {
            const cat = await models.Category.findByPk(category)
            if(!cat) {
                const newCat = await models.Category.create({name: category})
                if(!newCat) {
                    console.log(`WARNING: Can\' create ${cat} category`)
                }
            }
        }  
    }
    catch(err) {
        console.log(err)
    }

    console.log('Creating categories has finished!')
}

addCategoriesToDB()

module.exports = models
module.exports.db = db
module.exports.Sequelize = Sequelize