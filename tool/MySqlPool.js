require('dotenv').config();
const mysql = require('mysql');

const HOST = process.env.MYSQL_HOST;
const USERNAME = process.env.MYSQL_USERNAME;
const PASSWORD = process.env.MYSQL_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
});

pool.on('connection', function (connection) {
    console.log('Connected to database.');
});

const getConnection = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                if (error.code == 'ER_ACCESS_DENIED_ERROR') {
                    reject(new Error('Access denied for database.'));
                }
                reject(error);
            } else {
                resolve(connection);
            }
        });
    });
}

module.exports = {
    pool,
    getConnection
};