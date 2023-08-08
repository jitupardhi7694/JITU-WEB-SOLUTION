const { DataTypes } = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const Career = sqlize.define(
    'career',
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        age: {
            type: DataTypes.STRING(4),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        mobile: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
        },
        department: {
            type: DataTypes.INTEGER(150),
            allowNull: false,
        },
        education: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        current_organization: {
            type: DataTypes.STRING(155),
            allowNull: false,
        },
        from1: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        to1: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        designation1: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        location1: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        earlier_organization: {
            type: DataTypes.STRING(155),
            allowNull: false,
        },
        from2: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        to2: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        designation2: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        location2: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        file: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
    },
    {
        tableName: 'career',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = Career;
