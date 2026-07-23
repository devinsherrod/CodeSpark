/**
 * @file Progress.jsx
 * @description
 * Displays the user's coding progress, including completed
 * challenges, current streak, and current level.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";

/**
 * Progress page component.
 *
 * Retrieves and displays the current user's progress information
 * from the backend.
 *
 * @function Progress
 * @returns {JSX.Element} The progress page.
 */
function Progress() {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  /**
   * Loads the user's progress information when the page
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
      <h1>Progress</h1>

      {status === "loading" && <p>Loading progress...</p>}

      {status === "error" && (
        <p>Couldn't load your progress right now.</p>
      )}

      {status === "ready" && (
        <>
          <p>Completed Challenges: {progress.completedChallenges}</p>
          <p>Current Streak: {progress.currentStreak}</p>
          <p>Current Level: {progress.level}</p>
        </>
      )}

      <br />

      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default Progress;