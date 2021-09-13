/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Project', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            field: 'user_id',
            allowNull: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: true
        },
        created: {
            type: DataTypes.DECIMAL,
            field: 'created',
            allowNull: true
        },
        isPublic: {
            type: DataTypes.BOOLEAN,
            field: 'is_public',
            allowNull: true,
            defaultValue: true
        },
        desc: {
            type: DataTypes.TEXT,
            field: 'desc',
            allowNull: true
        },
        projectLang: {
            type: DataTypes.TEXT,
            field: 'project_lang',
            allowNull: true,
            defaultValue: "en"
        },
        views: {
            type: DataTypes.DECIMAL,
            field: 'views',
            allowNull: true,
            defaultValue: 0
        }
    }, {
        schema: 'public',
        tableName: 'projects',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
