/**
 * @file db.js
 * @description
 * Creates and exports a reusable MySQL connection pool for the
 * CodeSpark backend application.
 *
 * The connection pool improves performance by reusing existing
 * database connections instead of creating a new connection for
 * every request.
 */

const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * MySQL connection pool.
 *
 * Database configuration values are loaded from environment
 * variables. Default values are used if the environment
 * variables are not defined.
 *
 * @constant {import("mysql2/promise").Pool}
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "codespark_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Shared MySQL connection pool.
 *
 * Imported by route files to execute SQL queries using
 * asynchronous database operations.
 */
module.exports = pool;