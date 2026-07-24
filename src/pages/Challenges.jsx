/**
 * @file Challenges.jsx
 * @description
 * Displays all available coding challenges and allows the user
 * to navigate to an individual challenge.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChallenges } from "../api";

/**
 * Challenges page component.
 *
 * Retrieves the list of coding challenges from the backend and
 * displays each challenge with a button to open its details.
 *
 * @function Challenges
 * @returns {JSX.Element} The challenges page.
 */
function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  /**
   * Loads all available coding challenges when the page is first rendered.
   */
  useEffect(() => {
    getChallenges()
      .then((data) => {
        setChallenges(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="app-page">
      <h1>Challenges</h1>

      {status === "loading" && <p>Loading challenges...</p>}

      {status === "error" && (
        <p>Couldn't load challenges. Is the backend server running?</p>
      )}

      {status === "ready" && (
        <div>
          {challenges.map((challenge) => (
            <div key={challenge.id} className="challenge-row">
              <p>
                {challenge.title} ({challenge.difficulty})
              </p>

              <Link to={`/challenge/${challenge.id}`}>
                <button>Open Challenge</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <br />

      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default Challenges;