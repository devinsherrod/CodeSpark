/**
 * @file auth.js
 * @description
 * Defines API endpoints for user signup and login.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const pool = require("../config/db");

/**
 * Creates a new user account.
 *
 * @route POST /api/auth/signup
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Signup information.
 * @param {string} req.body.name - User's display name.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's plain-text password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the newly created user.
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [name.trim(), normalizedEmail, passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create account",
    });
  }
});

/**
 * Logs in an existing user.
 *
 * @route POST /api/auth/login
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Login information.
 * @param {string} req.body.email - User's email address.
 * @param {string} req.body.password - User's plain-text password.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Returns the logged-in user.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.query(
      `
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ?
      `,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const user = users[0];
    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to log in",
    });
  }
});

/**
 * Express router containing authentication-related API endpoints.
 */
module.exports = router;