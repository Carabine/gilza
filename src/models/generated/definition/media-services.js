/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MediaService', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        domain: {
            type: DataTypes.TEXT,
            field: 'domain',
            allowNull: true
        },
        isFull: {
            type: DataTypes.BOOLEAN,
            field: 'isFull',
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'isActive',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'media_services',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
