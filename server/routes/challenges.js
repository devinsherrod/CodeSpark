// routes/challenges.js
// All endpoints related to reading challenge data.
// Mounted in index.js at the path prefix /api/challenges

const express = require("express");
const router = express.Router(); // a "mini app" that groups related routes together
const pool = require("../config/db");

// GET /api/challenges
// Returns a lightweight list of every challenge (just enough to render
// a list page) — we don't send the full description/starter_code here
// since the list view doesn't need it.
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, difficulty FROM challenges ORDER BY id ASC"
    );
    res.json(rows); // Express automatically sets Content-Type: application/json
  } catch (err) {
    console.error(err);
    // 500 = generic server error. We don't leak the raw DB error to the
    // client, just log it server-side for debugging.
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

// GET /api/challenges/:id
// Returns full detail for ONE challenge, including description and
// starter_code, for the Challenge Detail page.
// :id is a route parameter — e.g. /api/challenges/3 sets req.params.id = "3"
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM challenges WHERE id = ?", // "?" is a placeholder filled in safely below
      [req.params.id]                          // prevents SQL injection — never string-concatenate user input into a query
    );

    if (rows.length === 0) {
      // No challenge with that id exists
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.json(rows[0]); // rows is always an array; we only want the single matching row
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

module.exports = router;
