/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Option', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        containerId: {
            type: DataTypes.UUID,
            field: 'container_id',
            allowNull: true
        },
        containerLinkId: {
            type: DataTypes.UUID,
            field: 'container_link_id',
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
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'options',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
