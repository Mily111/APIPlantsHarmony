const mysql = require("mysql2");
require("dotenv").config();

// Créez une connexion à la base de données avec un pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  queueLimit: 0,
});

// Pour utiliser des promesses avec mysql2
const promisePool = pool.promise();

module.exports = promisePool;
