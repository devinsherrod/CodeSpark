/**
 * @file challenges.js
 * @description
 * Defines API endpoints for retrieving coding challenge information.
 * These routes provide both the challenge list and individual
 * challenge details.
 */

const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * Retrieves a list of all coding challenges.
 *
 * @route GET /api/challenges
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns a JSON array of challenges.
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, title, difficulty FROM challenges ORDER BY id ASC"
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch challenges" });
  }
});

/**
 * Retrieves detailed information for a single coding challenge.
 *
 * @route GET /api/challenges/:id
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Route parameters.
 * @param {string} req.params.id - Challenge identifier.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the challenge details as JSON.
 */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM challenges WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch challenge" });
  }
});

/**
 * Express router containing challenge-related API endpoints.
 */
module.exports = router;