/**
 * @file ChallengeDetail.jsx
 * @description
 * Displays the details of a selected coding challenge.
 * Allows the user to view the challenge description,
 * write code, submit a solution, and view hints and results.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChallenge, submitChallenge } from "../api";

/**
 * Challenge detail page component.
 *
 * Retrieves a coding challenge based on the route parameter,
 * displays its information, and allows the user to submit
 * a solution for evaluation.
 *
 * @function ChallengeDetail
 * @returns {JSX.Element} The challenge detail page.
 */
function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /**
   * Loads the selected challenge when the page is opened
   * or whenever the challenge ID changes.
   */
  useEffect(() => {
    let cancelled = false;

    getChallenge(id).then(
      (data) => {
        if (cancelled) return;
        setChallenge(data);
        setCode(data.starter_code || "");
        setStatus("ready");
      },
      () => {
        if (!cancelled) setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  /**
   * Submits the user's solution to the backend for evaluation.
   *
   * Displays the result message returned by the backend,
   * including validation errors and failed test information.
   *
   * @async
   * @returns {Promise<void>}
   */
  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);

    try {
      const data = await submitChallenge(Number(id), code);

      setResult({
        passed: data.passed,
        message: data.message,
        error: data.error,
        expected: data.expected,
        actual: data.actual,
      });
    } catch (error) {
      setResult({
        requestError: true,
        message:
          error.message || "Something went wrong submitting. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="app-page">
        <p>Loading challenge...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="app-page">
        <p>Couldn't load this challenge. Is the backend server running?</p>

        <Link to="/challenges">
          <button>Back to Challenges</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="app-page">
      <h1>
        {challenge.title} ({challenge.difficulty})
      </h1>

      <p>{challenge.description}</p>

      <textarea
        rows="10"
        cols="50"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>

      <br />
      <br />

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit"}
      </button>

      {challenge.hint && (
        <>
          {" "}
          <button onClick={() => setShowHint((prev) => !prev)}>
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
        </>
      )}

      {showHint && challenge.hint && (
        <p className="hint-text">Hint: {challenge.hint}</p>
      )}

      {result && (
        <div className="result-text">
          <p>
            {result.message ||
              (result.passed
                ? "Passed! Nice work."
                : "Your code ran, but one or more tests failed.")}
          </p>

          {!result.passed && result.error && !result.requestError && (
            <p>Error: {result.error}</p>
          )}

          {!result.passed &&
            result.expected !== undefined &&
            result.actual !== undefined && (
              <>
                <p>Expected: {String(result.expected)}</p>
                <p>Actual: {String(result.actual)}</p>
              </>
            )}
        </div>
      )}

      <br />
      <br />

      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default ChallengeDetail;