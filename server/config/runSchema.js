const fs = require("fs");
const path = require("path");
const pool = require("./db");

async function runSchema() {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaText = fs.readFileSync(schemaPath, "utf8");

    // Remove full-line SQL comments, then separate the SQL statements.
    const statements = schemaText
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join("\n")
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log("Database schema created successfully.");
  } catch (err) {
    console.error("Failed to create database schema:");
    console.error(err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runSchema();