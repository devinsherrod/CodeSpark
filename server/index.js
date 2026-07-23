/**
 * @file index.js
 * @description
 * Entry point for the CodeSpark backend server.
 *
 * This file configures the Express application, registers middleware,
 * mounts API routes, and starts the HTTP server.
 */

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const challengesRoutes = require("./routes/challenges");
const submissionsRoutes = require("./routes/submissions");
const progressRoutes = require("./routes/progress");

const app = express();

/**
 * Port used by the backend server.
 *
 * Uses the PORT environment variable if available,
 * otherwise defaults to port 5050.
 *
 * @constant {number|string}
 */
const PORT = process.env.PORT || 5050;

/**
 * Enables Cross-Origin Resource Sharing (CORS) so the
 * React frontend can communicate with the backend.
 */
app.use(cors());

/**
 * Parses incoming JSON request bodies and makes the
 * parsed data available through req.body.
 */
app.use(express.json());

/**
 * Registers the API route handlers.
 */
app.use("/api/challenges", challengesRoutes);
app.use("/api/submissions", submissionsRoutes);
app.use("/api/progress", progressRoutes);

/**
 * Root endpoint used to verify that the backend server
 * is running correctly.
 *
 * @name GET /
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.get("/", (req, res) => {
  res.json({ status: "CodeSpark API running" });
});

/**
 * Starts the Express server when this file is executed
 * directly from Node.js.
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CodeSpark server listening on port ${PORT}`);
  });
}

/**
 * Express application instance.
 *
 * Exported for automated testing with Jest.
 */
module.exports = app;