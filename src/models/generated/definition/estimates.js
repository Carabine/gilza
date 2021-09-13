/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Estimate', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.UUID,
            field: 'project_id',
            allowNull: false
        },
        userId: {
            type: DataTypes.UUID,
            field: 'user_id',
            allowNull: false
        },
        isLike: {
            type: DataTypes.BOOLEAN,
            field: 'is_like',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'estimates',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
