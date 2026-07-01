// db.js
// Sets up a reusable MySQL connection pool that every route file imports
// and queries against. A "pool" is a collection of open connections that
// get reused across requests instead of opening/closing a new connection
// every single time — much faster and avoids exhausting MySQL's max
// connection limit under load.

const mysql = require("mysql2/promise"); // "promise" version lets us use async/await instead of callbacks
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "codespark_db",
  waitForConnections: true, // if all connections are busy, queue the request instead of erroring
  connectionLimit: 10,      // max simultaneous connections in the pool
  queueLimit: 0,            // 0 = unlimited queued requests waiting for a free connection
});

// Exported so route files can do: const pool = require("../config/db");
// then: await pool.query("SELECT ...")
module.exports = pool;
