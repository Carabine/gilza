/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('ProjectCategory', {
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
        categoryName: {
            type: DataTypes.TEXT,
            field: 'category_name',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'project_categories',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
