/**
 * @file Dashboard.jsx
 * @description
 * Displays the user's dashboard, including coding statistics,
 * current streak, XP, level, overall progress, and navigation links.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";
import Navbar from "../components/Navbar";

/**
 * Total number of coding challenges currently available.
 * Change this to 20 after the new challenges are added.
 *
 * @constant {number}
 */
const TOTAL_CHALLENGES = 9;

/**
 * XP awarded for each completed challenge.
 *
 * @constant {number}
 */
const XP_PER_CHALLENGE = 100;

/**
 * Calculates the user's level based on completed challenges.
 *
 * @param {number} completedChallenges
 * @returns {string} The calculated level.
 */
function getLevel(completedChallenges) {
  if (completedChallenges >= TOTAL_CHALLENGES) {
    return "CodeSpark Master";
  }

  if (completedChallenges >= 6) {
    return "Advanced";
  }

  if (completedChallenges >= 3) {
    return "Intermediate";
  }

  return "Beginner";
}

/**
 * Returns a motivational message based on user progress.
 *
 * @param {number} completedChallenges
 * @returns {string} A dashboard message.
 */
function getMotivationalMessage(completedChallenges) {
  if (completedChallenges >= TOTAL_CHALLENGES) {
    return "You completed every available challenge. Great work!";
  }

  if (completedChallenges >= 6) {
    return "You are making serious progress. Keep pushing toward mastery.";
  }

  if (completedChallenges >= 3) {
    return "You are building momentum. Keep practicing and growing.";
  }

  if (completedChallenges >= 1) {
    return "Great start. Complete another challenge to keep moving forward.";
  }

  return "Start your first challenge and begin building your coding streak.";
}

/**
 * Dashboard page component.
 *
 * Retrieves the current user's progress from the backend and
 * displays summary statistics and recommended actions.
 *
 * @function Dashboard
 * @returns {JSX.Element} The dashboard page.
 */
function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [status, setStatus] = useState("loading");

  /**
   * Loads the user's progress when the dashboard first renders.
   */
  useEffect(() => {
    getProgress()
      .then((data) => {
        setProgress(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const completedChallenges = progress?.completedChallenges || 0;
  const currentStreak = progress?.currentStreak || 0;

  const totalXP = completedChallenges * XP_PER_CHALLENGE;
  const currentLevel = getLevel(completedChallenges);

  const remainingChallenges = Math.max(
    TOTAL_CHALLENGES - completedChallenges,
    0
  );

  const progressPercentage = Math.min(
    Math.round((completedChallenges / TOTAL_CHALLENGES) * 100),
    100
  );

  const dailyGoalCompleted = completedChallenges > 0;

  return (
    <>
      <Navbar />

    <div className="app-page dashboard-page">
      <main className="dashboard-container">
        <section className="dashboard-hero">
          <div className="dashboard-hero-content">
            <p className="dashboard-label">Welcome Back</p>

            <h1>Ready to keep coding?</h1>

            <p className="dashboard-hero-text">
              {getMotivationalMessage(completedChallenges)}
            </p>

            <div className="dashboard-hero-buttons">
              <Link
                to="/challenges"
                className="dashboard-primary-link"
              >
                Continue Learning
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                to="/progress"
                className="dashboard-secondary-link"
              >
                View Progress
              </Link>
            </div>
          </div>

          <div className="dashboard-level-card">
            <span className="dashboard-level-icon">★</span>

            <p className="dashboard-level-label">
              Current Level
            </p>

            <h2>{currentLevel}</h2>

            <p>
              {remainingChallenges > 0
                ? `${remainingChallenges} challenge${
                    remainingChallenges === 1 ? "" : "s"
                  } remaining`
                : "All challenges completed"}
            </p>
          </div>
        </section>

        {status === "loading" && (
          <section className="dashboard-status-card">
            <p>Loading your dashboard...</p>
          </section>
        )}

        {status === "error" && (
          <section className="dashboard-status-card dashboard-error">
            <h2>We couldn't load your progress.</h2>
            <p>
              Make sure the backend server is running and refresh the page.
            </p>
          </section>
        )}

        {status === "ready" && (
          <>
            <section
              className="dashboard-stats-grid"
              aria-label="Coding statistics"
            >
              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">🔥</span>

                <div>
                  <p className="dashboard-stat-label">
                    Current Streak
                  </p>

                  <p className="dashboard-stat-value">
                    {currentStreak}
                  </p>

                  <p className="dashboard-stat-description">
                    {currentStreak === 1 ? "day active" : "days active"}
                  </p>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">✓</span>

                <div>
                  <p className="dashboard-stat-label">
                    Completed
                  </p>

                  <p className="dashboard-stat-value">
                    {completedChallenges}
                  </p>

                  <p className="dashboard-stat-description">
                    of {TOTAL_CHALLENGES} challenges
                  </p>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">⚡</span>

                <div>
                  <p className="dashboard-stat-label">
                    Total XP
                  </p>

                  <p className="dashboard-stat-value">
                    {totalXP}
                  </p>

                  <p className="dashboard-stat-description">
                    experience earned
                  </p>
                </div>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon">📈</span>

                <div>
                  <p className="dashboard-stat-label">
                    Overall Progress
                  </p>

                  <p className="dashboard-stat-value">
                    {progressPercentage}%
                  </p>

                  <p className="dashboard-stat-description">
                    course completed
                  </p>
                </div>
              </article>
            </section>

            <section className="dashboard-main-grid">
              <article className="dashboard-progress-panel">
                <div className="dashboard-section-header">
                  <div>
                    <p className="dashboard-section-label">
                      Your Progress
                    </p>

                    <h2>Challenge Completion</h2>
                  </div>

                  <span className="dashboard-progress-percent">
                    {progressPercentage}%
                  </span>
                </div>

                <div
                  className="dashboard-progress-bar"
                  role="progressbar"
                  aria-label="Overall challenge completion"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={progressPercentage}
                >
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="dashboard-progress-details">
                  <p>
                    <strong>{completedChallenges}</strong> completed
                  </p>

                  <p>
                    <strong>{remainingChallenges}</strong> remaining
                  </p>
                </div>

                <Link
                  to="/progress"
                  className="dashboard-text-link"
                >
                  See full progress
                  <span aria-hidden="true">→</span>
                </Link>
              </article>

              <article className="dashboard-goal-panel">
                <div className="dashboard-goal-top">
                  <span className="dashboard-goal-icon">
                    {dailyGoalCompleted ? "✓" : "⌁"}
                  </span>

                  <div>
                    <p className="dashboard-section-label">
                      Today's Goal
                    </p>

                    <h2>
                      {dailyGoalCompleted
                        ? "Keep your momentum going"
                        : "Complete one challenge"}
                    </h2>
                  </div>
                </div>

                <p className="dashboard-goal-description">
                  {dailyGoalCompleted
                    ? "You have already started making progress. Try another challenge to keep improving."
                    : "Complete one coding challenge today to begin building your streak."}
                </p>

                <div
                  className={`dashboard-goal-status ${
                    dailyGoalCompleted
                      ? "dashboard-goal-complete"
                      : ""
                  }`}
                >
                  <span>
                    {dailyGoalCompleted
                      ? "Goal started"
                      : "Not started"}
                  </span>

                  <span>{dailyGoalCompleted ? "1/1" : "0/1"}</span>
                </div>

                <Link
                  to="/challenges"
                  className="dashboard-goal-button"
                >
                  Choose a Challenge
                </Link>
              </article>
            </section>

            <section className="dashboard-next-section">
              <div className="dashboard-next-icon">
                {"</>"}
              </div>

              <div className="dashboard-next-content">
                <p className="dashboard-section-label">
                  Recommended Next Step
                </p>

                <h2>
                  {remainingChallenges > 0
                    ? "Continue with your next coding challenge"
                    : "Review the challenges you completed"}
                </h2>

                <p>
                  Practice regularly, test your solution, and use hints when
                  you get stuck.
                </p>
              </div>

              <Link
                to="/challenges"
                className="dashboard-next-button"
              >
                Browse Challenges
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
    </>
  );
}

export default Dashboard;