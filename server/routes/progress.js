// routes/progress.js
// M3: powers the Dashboard and Progress pages — completed-challenge
// count, current streak, and difficulty "level" — all derived from the
// submissions table that already existed from M2. No new tables needed.
// Mounted in index.js at the path prefix /api/progress

const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { calculateStreak } = require("../utils/streak");

const DIFFICULTY_RANK = { Easy: 1, Medium: 2, Hard: 3 };

// GET /api/progress/:userId
// Returns { completedChallenges, currentStreak, level } for the given user.
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // How many DISTINCT challenges this user has passed at least once.
    // (Someone can fail a challenge repeatedly then pass it once — that
    // still only counts as 1 completed challenge, not N submissions.)
    const [completedRows] = await pool.query(
      "SELECT COUNT(DISTINCT challenge_id) AS count FROM submissions WHERE user_id = ? AND passed = 1",
      [userId]
    );
    const completedChallenges = completedRows[0].count;

    // Every difficulty level the user has completed at least one
    // challenge in, so we can report the hardest one as their "level."
    const [difficultyRows] = await pool.query(
      `SELECT DISTINCT c.difficulty
       FROM submissions s
       JOIN challenges c ON c.id = s.challenge_id
       WHERE s.user_id = ? AND s.passed = 1`,
      [userId]
    );

    let level = "None";
    for (const row of difficultyRows) {
      if (level === "None" || DIFFICULTY_RANK[row.difficulty] > DIFFICULTY_RANK[level]) {
        level = row.difficulty;
      }
    }

    // Every distinct calendar day the user passed at least one
    // challenge — this is what the streak is built from.
    const [dayRows] = await pool.query(
      `SELECT DISTINCT DATE(submitted_at) AS day
       FROM submissions
       WHERE user_id = ? AND passed = 1
       ORDER BY day DESC`,
      [userId]
    );

    const currentStreak = calculateStreak(dayRows.map((r) => r.day));

    res.json({ completedChallenges, currentStreak, level });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

module.exports = router;
