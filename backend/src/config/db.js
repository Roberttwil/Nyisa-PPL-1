const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, '../../.env'),
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        logging: false,
    }
);

module.exports = sequelize;
