// index.js
// This is the entry point for the CodeSpark backend server.
// Running `npm start` (or `node index.js`) boots this file.
//
// What it does, in order:
//   1. Sets up an Express app (Express = lightweight Node.js web framework
//      for handling HTTP requests/responses and routing).
//   2. Loads middleware (cors, json parsing).
//   3. Mounts our two route files (challenges, submissions) under /api.
//   4. Starts listening for requests on a port.

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // loads variables from .env into process.env (DB_HOST, PORT, etc.)

// Import our route handlers. Each file below defines a set of related
// endpoints (e.g. all the /api/challenges routes live in routes/challenges.js).
const challengesRoutes = require("./routes/challenges");
const submissionsRoutes = require("./routes/submissions");

const app = express();
const PORT = process.env.PORT || 5050; // falls back to 5050 if .env doesn't set PORT

// --- Middleware ---
// cors() allows the React frontend (running on a different port, e.g. 5173)
// to make requests to this server without the browser blocking them.
app.use(cors());

// express.json() lets Express automatically parse incoming JSON request
// bodies into req.body, so routes can do things like `req.body.code`.
app.use(express.json());

// --- Routes ---
// Any request to /api/challenges/* gets handed off to challengesRoutes.
// Any request to /api/submissions/* gets handed off to submissionsRoutes.
app.use("/api/challenges", challengesRoutes);
app.use("/api/submissions", submissionsRoutes);

// Simple root route, useful for a quick "is the server alive?" check
// by just visiting http://localhost:5050/ in a browser.
app.get("/", (req, res) => {
  res.json({ status: "CodeSpark API running" });
});

// Start the server listening for incoming requests.
app.listen(PORT, () => {
  console.log(`CodeSpark server listening on port ${PORT}`);
});
