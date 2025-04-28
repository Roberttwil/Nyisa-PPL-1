const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Food = sequelize.define(
    "Food",
    {
        food_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "food",
        timestamps: false
    }
)

module.exports = Food;