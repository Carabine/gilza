/* eslint new-cap: "off", global-require: "off" */

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            field: 'id',
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.TEXT,
            field: 'username',
            allowNull: true
        },
        email: {
            type: DataTypes.TEXT,
            field: 'email',
            allowNull: true
        },
        password: {
            type: DataTypes.TEXT,
            field: 'password',
            allowNull: true
        },
        about: {
            type: DataTypes.TEXT,
            field: 'about',
            allowNull: true
        },
        birthData: {
            type: DataTypes.DATE,
            field: 'birth_data',
            allowNull: true
        },
        phone: {
            type: DataTypes.INTEGER,
            field: 'phone',
            allowNull: true
        },
        town: {
            type: DataTypes.TEXT,
            field: 'town',
            allowNull: true
        },
        avatar: {
            type: DataTypes.TEXT,
            field: 'avatar',
            allowNull: true
        },
        login: {
            type: DataTypes.TEXT,
            field: 'login',
            allowNull: true
        },
        lang: {
            type: DataTypes.TEXT,
            field: 'lang',
            allowNull: true
        }
    }, {
        schema: 'public',
        tableName: 'users',
        timestamps: false
    });
};

module.exports.initRelations = () => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

};
