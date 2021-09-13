/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Request', {
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
        body: {
            type: DataTypes.JSON,
            field: 'body',
            allowNull: true
        },
        created: {
            type: DataTypes.DECIMAL,
            field: 'created',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'requests',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
