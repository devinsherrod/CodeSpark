/**
 * @file progress.js
 * @description
 * Defines API endpoints for retrieving user progress statistics,
 * including completed challenges, current streak, and difficulty level.
 */

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { calculateStreak } = require("../utils/streak");

/**
 * Numeric ranking used to determine the highest completed difficulty level.
 *
 * @constant {Object<string, number>}
 */
const DIFFICULTY_RANK = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

/**
 * Retrieves progress statistics for a specific user.
 *
 * The response includes:
 * - Number of completed challenges
 * - Current submission streak
 * - Highest completed difficulty level
 *
 * @route GET /api/progress/:userId
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.userId - User identifier.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the user's progress information as JSON.
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [completedRows] = await pool.query(
      "SELECT COUNT(DISTINCT challenge_id) AS count FROM submissions WHERE user_id = ? AND passed = 1",
      [userId]
    );

    const completedChallenges = completedRows[0].count;

    const [difficultyRows] = await pool.query(
      `SELECT DISTINCT c.difficulty
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.user_id = ? AND s.passed = 1`,
      [userId]
    );

    let level = "None";

    for (const row of difficultyRows) {
      if (
        level === "None" ||
        DIFFICULTY_RANK[row.difficulty] > DIFFICULTY_RANK[level]
      ) {
        level = row.difficulty;
      }
    }

    const [dayRows] = await pool.query(
      `SELECT DISTINCT DATE(submitted_at) AS day
       FROM submissions
       WHERE user_id = ? AND passed = 1
       ORDER BY day DESC`,
      [userId]
    );

    const currentStreak = calculateStreak(dayRows.map((r) => r.day));

    res.json({
      completedChallenges,
      currentStreak,
      level,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch progress",
    });
  }
});

/**
 * Express router containing progress-related API endpoints.
 */
module.exports = router;