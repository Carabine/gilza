/* eslint global-require: "off" */
const model = {};
let initialized = false;

/**
 * Initializes sequelize models and their relations.
 * @param   {Object} sequelize  - Sequelize instance.
 * @returns {Object}            - Sequelize models.
 */
function init(sequelize) {
    delete module.exports.init; // Destroy itself to prevent repeated calls and clash with a model named 'init'.
    initialized = true;
    // Import model files and assign them to `model` object.
    model.Category = sequelize.import('./definition/categories.js');
    model.Container = sequelize.import('./definition/containers.js');
    model.Estimate = sequelize.import('./definition/estimates.js');
    model.FormItem = sequelize.import('./definition/form-items.js');
    model.Form = sequelize.import('./definition/forms.js');
    model.MediaServer = sequelize.import('./definition/media-servers.js');
    model.Option = sequelize.import('./definition/options.js');
    model.Pgmigration = sequelize.import('./definition/pgmigrations.js');
    model.ProjectCategory = sequelize.import('./definition/project-categories.js');
    model.Project = sequelize.import('./definition/projects.js');
    model.Request = sequelize.import('./definition/requests.js');
    model.User = sequelize.import('./definition/users.js');
    model.Video = sequelize.import('./definition/videos.js');

    // All models are initialized. Now connect them with relations.
    require('./definition/categories.js').initRelations();
    require('./definition/containers.js').initRelations();
    require('./definition/estimates.js').initRelations();
    require('./definition/form-items.js').initRelations();
    require('./definition/forms.js').initRelations();
    require('./definition/media-servers.js').initRelations();
    require('./definition/options.js').initRelations();
    require('./definition/pgmigrations.js').initRelations();
    require('./definition/project-categories.js').initRelations();
    require('./definition/projects.js').initRelations();
    require('./definition/requests.js').initRelations();
    require('./definition/users.js').initRelations();
    require('./definition/videos.js').initRelations();
    return model;
}

// Note: While using this module, DO NOT FORGET FIRST CALL model.init(sequelize). Otherwise you get undefined.
module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;
