import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [showIntro, setShowIntro] = useState(true);

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

  return (
    <div className="app-page">
      <div className="login-card">
        <h1 className="logo">CodeSpark</h1>

        <p className="tagline">Daily Coding Challenges for Beginners</p>

        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <Link to="/dashboard">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;