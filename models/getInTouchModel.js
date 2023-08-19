const { DataTypes } = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const getIn_Touch = sqlize.define(
    'getInTouch',
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(55),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(75),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = getIn_Touch;
