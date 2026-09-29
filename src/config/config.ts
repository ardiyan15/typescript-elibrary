import 'dotenv/config';

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
    },
};