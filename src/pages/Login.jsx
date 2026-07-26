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
 * Displays an animated splash screen when the application first loads.
 * After the splash screen fades away, the user can enter an email
 * address and password and continue to the dashboard.
 *
 * @function Login
 * @returns {JSX.Element} The login page interface.
 */
function Login() {
  const [showIntro, setShowIntro] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  /**
   * Displays the introductory splash screen briefly before
   * fading it out and revealing the login form.
   */
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIntroLeaving(true);
    }, 2500);

    const hideTimer = setTimeout(() => {
      setShowIntro(false);
    }, 3800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

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
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    navigate("/dashboard");
  }

  /**
   * Allows the user to submit the login form by pressing Enter.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} event
   * @returns {void}
   */
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleLogin();
    }
  }

  if (showIntro) {
    return (
      <div className={`intro-page ${introLeaving ? "intro-leaving" : ""}`}>
        <div className="intro-glow"></div>

        <h1 className="intro-logo">CodeSpark</h1>

        <p className="intro-text">
          Build your coding habit one challenge at a time.
        </p>

        <div className="intro-code-line">
          <span>const</span> future = <span>"built daily"</span>;
        </div>
      </div>
    );
  }

  return (
    <div className="app-page login-page">
      <div className="login-card">
        <p className="login-eyebrow">Welcome Back</p>

        <h1 className="logo">CodeSpark</h1>

        <p className="tagline">
          Daily coding challenges that help you improve one problem at a time.
        </p>

        <div className="login-form">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
          />

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button className="login-button" onClick={handleLogin}>
            Login
          </button>
        </div>

        <p className="login-footer">
          Practice consistently. Track your progress. Build confidence.
        </p>
      </div>
    </div>
  );
}

export default Login;