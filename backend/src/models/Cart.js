const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cart = sequelize.define(
    "Cart",
    {
        cart_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        booking_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        food_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        tableName: "cart",
        timestamps: false
    }
)

Cart.associate = (models) => {
    Cart.belongsTo(models.Food, {
        foreignKey: 'food_id',
        as: 'food'
    });
};

module.exports = Cart;