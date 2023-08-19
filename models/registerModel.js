const { DataTypes } = require('sequelize');
const sqlize = require('../helpers/authentication/init-mysql');

const userRegister = sqlize.define(
    'register',
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(145),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(75),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        activation_key: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        reset_key: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'user_roles',
                key: 'id',
            },
        },
    },
    {
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        indexes: [
            {
                name: 'PRIMARY',
                unique: true,
                using: 'BTREE',
                fields: [{ name: 'id' }],
            },
            {
                name: 'idfkuser',
                using: 'BTREE',
                fields: [{ name: 'id' }],
            },
        ],
    }
);

module.exports = userRegister;
