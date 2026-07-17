import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";

function Progress() {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

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
      {status === "error" && <p>Couldn't load your progress right now.</p>}
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
