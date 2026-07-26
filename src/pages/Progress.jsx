/**
 * @file Progress.jsx
 * @description
 * Displays the user's coding progress, including completed
 * challenges, streak, XP, level, achievements, and overall progress.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProgress } from "../api";
import Navbar from "../components/Navbar";

/**
 * Total number of coding challenges currently available.
 * Update this to 20 after the new challenges are added.
 *
 * @constant {number}
 */
const TOTAL_CHALLENGES = 20;

/**
 * XP awarded for every completed challenge.
 *
 * @constant {number}
 */
const XP_PER_CHALLENGE = 100;

/**
 * Determines the user's current level based on completed challenges.
 *
 * @param {number} completedChallenges
 * @returns {string} The user's calculated level.
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
 * Determines the next challenge milestone.
 *
 * @param {number} completedChallenges
 * @returns {{target: number, label: string}}
 */
function getNextMilestone(completedChallenges) {
  if (completedChallenges < 3) {
    return {
      target: 3,
      label: "Intermediate",
    };
  }

  if (completedChallenges < 6) {
    return {
      target: 6,
      label: "Advanced",
    };
  }

  if (completedChallenges < TOTAL_CHALLENGES) {
    return {
      target: TOTAL_CHALLENGES,
      label: "CodeSpark Master",
    };
  }

  return {
    target: TOTAL_CHALLENGES,
    label: "CodeSpark Master",
  };
}

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
  const [status, setStatus] = useState("loading");

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

  const completedChallenges = progress?.completedChallenges || 0;
  const currentStreak = progress?.currentStreak || 0;

  const progressPercentage = Math.min(
    Math.round((completedChallenges / TOTAL_CHALLENGES) * 100),
    100
  );

  const totalXP = completedChallenges * XP_PER_CHALLENGE;
  const currentLevel = getLevel(completedChallenges);
  const nextMilestone = getNextMilestone(completedChallenges);

  const challengesUntilNextLevel = Math.max(
    nextMilestone.target - completedChallenges,
    0
  );

  const achievements = [
    {
      title: "First Step",
      description: "Complete your first coding challenge.",
      icon: "✓",
      unlocked: completedChallenges >= 1,
    },
    {
      title: "Getting Started",
      description: "Complete three coding challenges.",
      icon: "🚀",
      unlocked: completedChallenges >= 3,
    },
    {
      title: "On Fire",
      description: "Build a three-day coding streak.",
      icon: "🔥",
      unlocked: currentStreak >= 3,
    },
    {
      title: "Challenge Crusher",
      description: "Complete six coding challenges.",
      icon: "🏆",
      unlocked: completedChallenges >= 6,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="app-page progress-page">
        <div className="progress-card">
          <div className="progress-header">
            <p className="progress-label">Your Coding Journey</p>
            <h1>Progress</h1>

          <p className="progress-subtitle">
            Keep practicing, earn XP, and unlock new milestones.
          </p>
        </div>

        {status === "loading" && (
          <p className="progress-message">Loading progress...</p>
        )}

        {status === "error" && (
          <p className="progress-message progress-error">
            Couldn't load your progress right now.
          </p>
        )}

        {status === "ready" && (
          <>
            <section className="progress-overall-section">
              <div className="progress-overview">
                <div>
                  <p className="progress-overview-label">
                    Overall Progress
                  </p>

                  <p className="progress-overview-number">
                    {completedChallenges} of {TOTAL_CHALLENGES} challenges
                  </p>
                </div>

                <p className="progress-percentage">
                  {progressPercentage}%
                </p>
              </div>

              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Challenge completion progress"
              >
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </section>

            <section className="progress-stats">
              <div className="progress-stat-card">
                <span className="progress-stat-icon">✓</span>

                <p className="progress-stat-value">
                  {completedChallenges}
                </p>

                <p className="progress-stat-title">
                  Challenges Completed
                </p>
              </div>

              <div className="progress-stat-card">
                <span className="progress-stat-icon">🔥</span>

                <p className="progress-stat-value">
                  {currentStreak}
                </p>

                <p className="progress-stat-title">
                  Day Streak
                </p>
              </div>

              <div className="progress-stat-card">
                <span className="progress-stat-icon">⚡</span>

                <p className="progress-stat-value">
                  {totalXP}
                </p>

                <p className="progress-stat-title">
                  Total XP
                </p>
              </div>

              <div className="progress-stat-card">
                <span className="progress-stat-icon">★</span>

                <p className="progress-stat-value progress-level-value">
                  {currentLevel}
                </p>

                <p className="progress-stat-title">
                  Current Level
                </p>
              </div>
            </section>

            <section className="progress-next-goal">
              <div>
                <p className="progress-section-label">
                  Next Goal
                </p>

                {challengesUntilNextLevel > 0 ? (
                  <h2>
                    Complete {challengesUntilNextLevel} more{" "}
                    {challengesUntilNextLevel === 1
                      ? "challenge"
                      : "challenges"}{" "}
                    to reach {nextMilestone.label}.
                  </h2>
                ) : (
                  <h2>
                    You completed every available challenge!
                  </h2>
                )}
              </div>

              <Link to="/challenges">
                <button className="progress-continue-button">
                  Continue Learning
                </button>
              </Link>
            </section>

            <section className="achievements-section">
              <div className="progress-section-heading">
                <div>
                  <p className="progress-section-label">
                    Achievements
                  </p>

                  <h2>Your Milestones</h2>
                </div>

                <p className="achievement-count">
                  {achievements.filter((achievement) => achievement.unlocked).length}
                  /{achievements.length} unlocked
                </p>
              </div>

              <div className="achievement-grid">
                {achievements.map((achievement) => (
                  <article
                    className={`achievement-card ${
                      achievement.unlocked
                        ? "achievement-unlocked"
                        : "achievement-locked"
                    }`}
                    key={achievement.title}
                  >
                    <span className="achievement-icon">
                      {achievement.unlocked ? achievement.icon : "🔒"}
                    </span>

                    <div>
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                    </div>

                    <span className="achievement-status">
                      {achievement.unlocked ? "Unlocked" : "Locked"}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        <Link to="/dashboard">
          <button className="progress-back-button">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
    </>
  );
}

export default Progress;