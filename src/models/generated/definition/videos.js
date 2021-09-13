/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Video', {
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
        fileName: {
            type: DataTypes.TEXT,
            field: 'file_name',
            allowNull: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: true
        },
        preview: {
            type: DataTypes.TEXT,
            field: 'preview',
            allowNull: true
        },
        created: {
            type: DataTypes.DECIMAL,
            field: 'created',
            allowNull: true
        },
        size: {
            type: DataTypes.DECIMAL,
            field: 'size',
            allowNull: true
        },
        domain: {
            type: DataTypes.TEXT,
            field: 'domain',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'videos',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
