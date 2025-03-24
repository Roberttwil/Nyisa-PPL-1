const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Users = sequelize.define(
    "Users",
    {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        tableName: "users",
        timestamps: false
    }
)

module.exports = Users;