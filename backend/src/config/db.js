const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, "../../.env")
});

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        logging: false // enable if need to debug
    }
)

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})

module.exports = sequelize;