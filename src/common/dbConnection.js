var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT || '3306',
    user: process.env.DB_USERNAME || 'movies_user',
    password: process.env.DB_PASSWORD || 'Pa55W0rd',
    database: process.env.DB_NAME || 'movies_data'

});
module.exports = connection;