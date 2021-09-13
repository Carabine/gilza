/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('FormItem', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name',
            allowNull: true
        },
        formId: {
            type: DataTypes.UUID,
            field: 'form_id',
            allowNull: true
        },
        created: {
            type: DataTypes.DECIMAL,
            field: 'created',
            allowNull: false
        }
    }, {
        schema: 'public',
        tableName: 'form_items',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
