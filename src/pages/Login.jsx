import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
