import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getChallenges } from "../api";
import Navbar from "../components/Navbar";

function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    getChallenges()
      .then((data) => {
        setChallenges(data);
        setStatus("ready");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  const filteredChallenges = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return challenges.filter((challenge) => {
      const matchesDifficulty =
        difficulty === "All" ||
        challenge.difficulty === difficulty;

      const matchesSearch =
        challenge.title.toLowerCase().includes(searchTerm) ||
        (challenge.description || "")
          .toLowerCase()
          .includes(searchTerm);

      return matchesDifficulty && matchesSearch;
    });
  }, [challenges, difficulty, search]);

  const getEstimatedTime = (level) => {
    if (level === "Easy") {
      return "5 min";
    }

    if (level === "Medium") {
      return "10 min";
    }

    return "15 min";
  };

  const getXpReward = (level) => {
    if (level === "Easy") {
      return "100 XP";
    }

    if (level === "Medium") {
      return "200 XP";
    }

    return "300 XP";
  };

  const clearFilters = () => {
    setSearch("");
    setDifficulty("All");
  };

  return (
    <>
      <Navbar />

      <div className="app-page challenges-page">
        <div className="challenges-header">
          <h1>Coding Challenges</h1>

          <p>
            Practice your programming skills by solving coding
            challenges of different difficulty levels.
          </p>
        </div>

        <input
          className="challenge-search"
          type="text"
          placeholder="Search challenges..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="difficulty-filter">
          {["All", "Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              type="button"
              className={
                difficulty === level
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>

        {status === "loading" && (
          <p className="challenge-status">
            Loading challenges...
          </p>
        )}

        {status === "error" && (
          <p className="challenge-status challenge-error">
            Couldn't load challenges.
          </p>
        )}

        {status === "ready" && (
          <div className="challenge-results">
            <p className="challenge-count">
              {filteredChallenges.length}{" "}
              {filteredChallenges.length === 1
                ? "Challenge"
                : "Challenges"}
            </p>

            {filteredChallenges.length === 0 ? (
              <div className="challenge-empty-state">
                <h2>No challenges found</h2>

                <p>
                  Try changing your search or selecting a different
                  difficulty.
                </p>

                <button
                  type="button"
                  className="challenge-reset-button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="challenge-grid">
                {filteredChallenges.map((challenge) => {
                  const isCompleted = Boolean(
                    Number(challenge.completed)
                  );

                  return (
                    <div
                      className={
                        isCompleted
                          ? "challenge-card challenge-card-completed"
                          : "challenge-card"
                      }
                      key={challenge.id}
                    >
                      <div className="challenge-card-header">
                        <span
                          className={`challenge-level ${challenge.difficulty.toLowerCase()}`}
                        >
                          <span className="challenge-level-dot" />

                          {challenge.difficulty}
                        </span>

                        <div className="challenge-card-header-right">
                          {isCompleted && (
                            <span className="challenge-completed-badge">
                              ✓ Completed
                            </span>
                          )}

                          <span className="challenge-number">
                            #
                            {String(challenge.id).padStart(
                              3,
                              "0"
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="challenge-card-content">
                        <h2>{challenge.title}</h2>

                        <p className="challenge-description">
                          {challenge.description ||
                            "Complete this coding challenge to test your programming skills."}
                        </p>
                      </div>

                      <div className="challenge-meta">
                        <span>
                          ⏱{" "}
                          {getEstimatedTime(
                            challenge.difficulty
                          )}
                        </span>

                        <span>
                          ⭐{" "}
                          {getXpReward(
                            challenge.difficulty
                          )}
                        </span>
                      </div>

                      <div className="challenge-card-divider" />

                      <div className="challenge-card-footer">
                        <span className="challenge-hint">
                          {isCompleted
                            ? "✓ Challenge completed"
                            : "💡 Hint available"}
                        </span>

                        <Link
                          to={`/challenge/${challenge.id}`}
                        >
                          <button
                            type="button"
                            className="challenge-button"
                          >
                            {isCompleted
                              ? "Solve Again →"
                              : "Solve Challenge →"}
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Challenges;