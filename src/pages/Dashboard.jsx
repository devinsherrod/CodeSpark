/**
 * @file Dashboard.jsx
 * @description
 * Displays the user's dashboard, including coding statistics,
 * current streak, completed challenges, and navigation links.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";

/**
 * Dashboard page component.
 *
 * Retrieves the current user's progress from the backend and
 * displays summary statistics such as streak, completed
 * challenges, and current level.
 *
 * @function Dashboard
 * @returns {JSX.Element} The dashboard page.
 */
function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  /**
   * Loads the user's progress information when the dashboard
   * is first rendered.
   */
  useEffect(() => {
    getProgress()
      .then((data) => {
        setProgress(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="app-page">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <div className="stats-box">
          {status === "loading" && <p>Loading stats...</p>}
          {status === "error" && <p>Couldn't load your stats right now.</p>}
          {status === "ready" && (
            <>
              <p>
                Current Streak: {progress.currentStreak} day
                {progress.currentStreak === 1 ? "" : "s"}
              </p>
              <p>Challenges Completed: {progress.completedChallenges}</p>
              <p>Current Level: {progress.level}</p>
            </>
          )}
        </div>

        <div className="button-group">
          <Link to="/challenges">
            <button>View Challenges</button>
          </Link>

          <Link to="/progress">
            <button>View Progress</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;