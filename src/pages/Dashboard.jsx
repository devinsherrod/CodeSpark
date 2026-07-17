import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";

function Dashboard() {
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
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <div className="stats-box">
          {status === "loading" && <p>Loading stats...</p>}
          {status === "error" && <p>Couldn't load your stats right now.</p>}
          {status === "ready" && (
            <>
              <p>Current Streak: {progress.currentStreak} day{progress.currentStreak === 1 ? "" : "s"}</p>
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
