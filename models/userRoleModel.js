const { sequelize, DataTypes } = require('sequelize');
const db = require('../helpers/authentication/init-mysql');

const UserRoles = db.define(
    'user_roles',
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        role_name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },

    {
        tableName: 'user_roles',
        timestamps: true,
        // createdAt: 'createdAt',
        // updatedAt: 'updatedAt',
    }
);

module.exports = UserRoles;
