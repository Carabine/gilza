/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Category', {
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: false,
            primaryKey: true
        }
    }, {
        schema: 'public',
        tableName: 'categories',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
