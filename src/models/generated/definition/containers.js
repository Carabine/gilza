/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Container', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.UUID,
            field: 'project_id',
            allowNull: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: true
        },
        videoId: {
            type: DataTypes.UUID,
            field: 'video_id',
            allowNull: true
        },
        videoInsc: {
            type: DataTypes.TEXT,
            field: 'video_insc',
            allowNull: true
        },
        isFinal: {
            type: DataTypes.BOOLEAN,
            field: 'is_final',
            allowNull: true
        },
        callbackType: {
            type: DataTypes.TEXT,
            field: 'callback_type',
            allowNull: true
        },
        created: {
            type: DataTypes.DECIMAL,
            field: 'created',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'containers',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
