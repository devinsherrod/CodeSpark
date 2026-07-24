/**
 * @file Login.jsx
 * @description
 * Displays the login page for the CodeSpark application.
 * Includes a short introductory splash screen and a simple
 * login form for navigating to the dashboard.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Login page component.
 *
 * Displays a splash screen when the application first loads.
 * After the splash screen disappears, the user can enter an
 * email address and password. Successful validation redirects
 * the user to the dashboard.
 *
 * @function Login
 * @returns {JSX.Element} The login page interface.
 */
function Login() {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * Displays the introductory splash screen for two seconds
   * before showing the login form.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return (
      <div className="intro-page">
        <h1 className="intro-logo">CodeSpark</h1>
        <p className="intro-text">Build your coding habit one challenge at a time.</p>
      </div>
    );
  }

  /**
   * Validates the login form.
   *
   * If both email and password are provided, the user is
   * redirected to the dashboard. Otherwise an error message
   * is displayed.
   *
   * @returns {void}
   */
  function handleLogin() {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    navigate("/dashboard");
  }

  return (
    <div className="app-page">
      <div className="login-card">
        <h1 className="logo">CodeSpark</h1>

        <p className="tagline">Daily Coding Challenges for Beginners</p>

        <input
          type="text"
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

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;