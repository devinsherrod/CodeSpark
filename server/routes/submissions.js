/**
 * @file submissions.js
 * @description
 * Defines API endpoints for submitting coding challenge solutions
 * and retrieving a user's submission history.
 */

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { runChallengeTests } = require("../utils/ChallengeRunner");

/**
 * Submits a coding challenge solution for evaluation.
 *
 * The submitted code is executed against predefined automated
 * test cases. The submission result is stored in the database
 * whether the solution passes or fails.
 *
 * @route POST /api/submissions
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Request body.
 * @param {number} req.body.challengeId - Identifier of the challenge.
 * @param {number} req.body.userId - Identifier of the user.
 * @param {string} req.body.code - Source code submitted by the user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the submission result as JSON.
 */
router.post("/", async (req, res) => {
  const { challengeId, userId, code } = req.body;

if (challengeId === undefined || userId === undefined) {
  return res.status(400).json({
    error: "challengeId and userId are required",
  });
}

if (typeof code !== "string" || code.trim() === "") {
  return res.status(400).json({
    error: "Please enter a solution before submitting.",
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

    const testResult = runChallengeTests(challenge.title, code);
    const passed = testResult.passed === true;

    const [result] = await pool.query(
      "INSERT INTO submissions (challenge_id, user_id, code, passed) VALUES (?, ?, ?, ?)",
      [parsedChallengeId, parsedUserId, code, passed]
    );

    res.status(201).json({
      submissionId: result.insertId,
      challengeId: parsedChallengeId,
      challengeTitle: challenge.title,
      passed,
      message: passed
        ? "Passed! Nice work."
        : testResult.error
          ? "Your code could not run because it contains an error."
          : "Your code ran, but one or more tests failed.",
      error: testResult.error || null,
      testNumber: testResult.testNumber,
      input: testResult.input,
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

/**
 * Retrieves the submission history for a specific user.
 *
 * Results are ordered from the newest submission to the oldest.
 *
 * @route GET /api/submissions/:userId
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.userId - User identifier.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the user's submission history as JSON.
 */
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

/**
 * Express router containing submission-related API endpoints.
 */
module.exports = router;