import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="app-page">
      <div className="dashboard-card">
        <h1>Dashboard</h1>

        <div className="stats-box">
          <p>Current Streak: 5 days</p>
          <p>Challenges Completed: 12</p>
          <p>Current Level: Easy</p>
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