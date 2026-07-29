const mysql = require("mysql2/promise");
require("dotenv").config();

async function createDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    await connection.query(
      "CREATE DATABASE IF NOT EXISTS codespark_db"
    );

    console.log("Database codespark_db created successfully.");
  } catch (err) {
    console.error("Failed to create database:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createDatabase();