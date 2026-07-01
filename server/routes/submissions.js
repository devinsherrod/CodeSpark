// routes/submissions.js
// Handles code submissions: saving them and checking pass/fail.
// Mounted in index.js at the path prefix /api/submissions

const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// POST /api/submissions
// Body: { challengeId, userId, code }
//
// IMPORTANT — read this before extending it:
// This does NOT actually execute the submitted JavaScript code. Running
// arbitrary user-submitted code safely requires a sandboxed environment
// (isolated process/container, timeouts, memory limits) to stop someone
// from submitting something malicious or an infinite loop. That's a
// bigger feature than fits in the M2 timeline, so for now we're using a
// placeholder check: does the submitted code CONTAIN the challenge's
// expected output as a substring? It's not a real test runner, but it
// gives Devin a real endpoint with real pass/fail behavior to write
// tests against. Swapping in real execution later only means changing
// the logic inside this one route — the request/response shape won't
// need to change.
router.post("/", async (req, res) => {
  const { challengeId, userId, code } = req.body;

  // Basic validation — make sure the caller actually sent what we need
  // before touching the database.
  if (!challengeId || !userId || !code) {
    return res
      .status(400) // 400 = bad request (client's fault, missing data)
      .json({ error: "challengeId, userId, and code are required" });
  }

  try {
    // Look up the expected output for this challenge so we have
    // something to compare the submission against.
    const [challengeRows] = await pool.query(
      "SELECT expected_output FROM challenges WHERE id = ?",
      [challengeId]
    );

    if (challengeRows.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const expectedOutput = challengeRows[0].expected_output;

    // --- Placeholder "test runner" ---
    // Real version (future milestone) would actually execute `code` in
    // a sandbox and compare its real output. For now: naive substring check.
    const passed = code.includes(expectedOutput);

    // Save the submission attempt either way (pass or fail) so we have
    // a history — useful later for the Progress/Dashboard pages.
    const [result] = await pool.query(
      "INSERT INTO submissions (challenge_id, user_id, code, passed) VALUES (?, ?, ?, ?)",
      [challengeId, userId, code, passed]
    );

    // 201 = Created, since we successfully created a new submission record
    res.status(201).json({
      submissionId: result.insertId, // MySQL gives us the auto-increment id of the new row
      passed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process submission" });
  }
});

// GET /api/submissions/:userId
// Returns every submission a given user has made, most recent first.
// Useful for a future "submission history" or Progress page.
router.get("/:userId", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC",
      [req.params.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

module.exports = router;
