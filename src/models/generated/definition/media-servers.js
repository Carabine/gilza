/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('MediaServer', {
        domain: {
            type: DataTypes.TEXT,
            field: 'domain',
            allowNull: false,
            primaryKey: true
        },
        isFull: {
            type: DataTypes.BOOLEAN,
            field: 'is_full',
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'media_servers',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
