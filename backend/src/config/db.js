const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT, 10) || 3307,
        logging: false,
    }
);

module.exports = sequelize;
