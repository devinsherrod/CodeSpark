/**
 * @file Signup.jsx
 * @description
 * Displays the sign up page for the CodeSpark application.
 * Allows users to enter account information with basic
 * client-side validation.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Sign Up page component.
 *
 * Allows users to enter a name, email, and password.
 * Performs basic validation before allowing account creation.
 *
 * @returns {JSX.Element} The sign up page.
 */
function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Validates the sign up form.
   */
  function handleSignup() {
    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Placeholder until backend authentication is implemented
    setSuccess("Account created! Please log in.");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  }

  return (
    <div className="app-page">
      <div className="login-card">
        <h1 className="logo">CodeSpark</h1>

        <p className="tagline">
          Create your CodeSpark account
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {success && (
          <p className="success-message">
            {success}
          </p>
        )}

        <button onClick={handleSignup}>
          Create Account
        </button>

        <p style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
