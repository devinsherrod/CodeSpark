// routes/submissions.js
// Handles code submissions: saving them, running automated tests,
// and returning pass/fail results.
// Mounted in index.js at the path prefix /api/submissions

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { runChallengeTests } = require("../utils/challengeRunner");

// POST /api/submissions
// Body: { challengeId, userId, code }
//
// IMPORTANT — read this before extending it:
// Unlike the original implementation, this route now executes the
// submitted JavaScript against predefined test cases for each challenge.
// The actual test logic lives inside utils/challengeRunner.js so new
// challenges can be added without modifying this route.
//
// Each challenge is mapped to one or more automated test cases.
// When a submission is received, this route looks up the challenge,
// sends the submitted code to the challenge runner, records whether
// the submission passed or failed, and stores every attempt in the
// database. Keeping every submission allows future features like
// progress tracking, submission history, and statistics.
//
// This route is intentionally responsible only for:
//
//   • validating incoming requests
//   • retrieving challenge information
//   • running the challenge tests
//   • saving the submission
//   • returning the results
//
// Any future improvements to how challenges are executed (additional
// languages, sandboxing, hidden test cases, performance limits, etc.)
// should be implemented inside challengeRunner.js so this route remains
// simple and easy to maintain.
router.post("/", async (req, res) => {
  const { challengeId, userId, code } = req.body;

  // Basic validation — make sure the caller actually sent what we need
  // before touching the database.
  if (
    challengeId === undefined ||
    userId === undefined ||
    typeof code !== "string" ||
    code.trim() === ""
  ) {
    return res.status(400).json({
      error: "challengeId, userId, and code are required",
    });
  }

  const parsedChallengeId = Number(challengeId);
  const parsedUserId = Number(userId);

  if (
    !Number.isInteger(parsedChallengeId) ||
    parsedChallengeId <= 0 ||
    !Number.isInteger(parsedUserId) ||
    parsedUserId <= 0
  ) {
    return res.status(400).json({
      error: "challengeId and userId must be positive whole numbers",
    });
  }

  try {
    // Look up the challenge so we know which automated test suite to run.
    const [challengeRows] = await pool.query(
      "SELECT id, title FROM challenges WHERE id = ?",
      [parsedChallengeId]
    );

    if (challengeRows.length === 0) {
      return res.status(404).json({
        error: "Challenge not found",
      });
    }

    const challenge = challengeRows[0];

    // Run the submitted code against the automated tests configured
    // for this challenge. The challenge runner returns whether every
    // test passed along with any additional information about failures.
    const testResult = runChallengeTests(challenge.title, code);
    const passed = testResult.passed === true;

    // Save every submission attempt, whether it passed or failed.
    // This allows the application to show submission history,
    // progress tracking, and future performance analytics.
    const [result] = await pool.query(
      "INSERT INTO submissions (challenge_id, user_id, code, passed) VALUES (?, ?, ?, ?)",
      [parsedChallengeId, parsedUserId, code, passed]
    );

    // 201 = Created, since we successfully created a new submission record
    res.status(201).json({
      submissionId: result.insertId,
      challengeId: parsedChallengeId,
      challengeTitle: challenge.title,
      passed,
      message: passed ? "Passed! Nice work." : "Not quite—try again.",
      error: testResult.error || null,
      expected: passed ? undefined : testResult.expected,
      actual: passed ? undefined : testResult.actual,
    });
  } catch (err) {
    console.error("Submission processing error:", err);
    res.status(500).json({
      error: "Failed to process submission",
    });
  }
});

// GET /api/submissions/:userId
// Returns every submission a given user has made, most recent first.
// Useful for the Progress page, submission history,
// and future dashboard analytics.
router.get("/:userId", async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({
      error: "userId must be a positive whole number",
    });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT
        submissions.id,
        submissions.challenge_id,
        challenges.title AS challenge_title,
        submissions.user_id,
        submissions.code,
        submissions.passed,
        submissions.submitted_at
      FROM submissions
      JOIN challenges
        ON submissions.challenge_id = challenges.id
      WHERE submissions.user_id = ?
      ORDER BY submissions.submitted_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Submission history error:", err);
    res.status(500).json({
      error: "Failed to fetch submissions",
    });
  }
});

module.exports = router;