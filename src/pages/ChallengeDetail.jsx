/**
 * @file ChallengeDetail.jsx
 * @description
 * Displays a selected coding challenge, Monaco code editor,
 * hint controls, submission feedback, and navigation.
 */

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link, useParams } from "react-router-dom";
import { getChallenge, submitChallenge } from "../api";
import Navbar from "../components/Navbar";
import Confetti from "react-confetti";

function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [status, setStatus] = useState("loading");
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        if (!cancelled) {
          setStatus("error");
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!showSuccess) return undefined;

    const successTimer = window.setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    return () => {
      window.clearTimeout(successTimer);
    };
  }, [showSuccess]);

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);
    setShowSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    try {
      const data = await submitChallenge(Number(id), code);

      setResult({
        passed: data.passed,
        message: data.message,
        error: data.error,
        testNumber: data.testNumber,
        input: data.input,
        expected: data.expected,
        actual: data.actual,
      });

      if (data.passed) {
        setShowSuccess(true);
        setShowConfetti(true);

        setTimeout(() => {
          setShowConfetti(false);
        }, 3500);
      }

    } catch (error) {
      setResult({
        passed: false,
        requestError: true,
        message:
          error.message ||
          "Something went wrong while submitting. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetCode() {
    setCode(challenge?.starter_code || "");
    setResult(null);
    setShowSuccess(false);
  }

  function getEstimatedTime(level) {
    if (level === "Easy") {
      return "5 min";
    }

    if (level === "Medium") {
      return "10 min";
    }

    return "15 min";
  }

  function getXpReward(level) {
    if (level === "Easy") {
      return "100 XP";
    }

    if (level === "Medium") {
      return "200 XP";
    }

    return "300 XP";
  }

  if (status === "loading") {
    return (
      <>
        <Navbar />

        <div className="app-page challenge-detail-page">
          <div className="challenge-loading-card">
            <p>Loading challenge...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Navbar />

        <div className="app-page challenge-detail-page">
          <div className="challenge-error-card">
            <h1>Challenge unavailable</h1>

            <p>
              Couldn't load this challenge. Make sure the backend server is
              running and try again.
            </p>

            <Link to="/challenges">
              <button type="button" className="challenge-back-button">
                ← Back to Challenges
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      {showSuccess && (
        <div className="challenge-success-popup" role="status">
          <div className="challenge-success-check">✓</div>

          <div>
            <strong>Challenge completed!</strong>
            <span>All automated tests passed.</span>
          </div>
        </div>
      )}

      <div className="app-page challenge-detail-page">
        <div className="challenge-detail-navigation">
          <Link to="/challenges" className="challenge-back-link">
            ← Back to Challenges
          </Link>

          <span className="challenge-detail-number">
            #{String(challenge.id).padStart(3, "0")}
          </span>
        </div>

        <header className="challenge-detail-header">
          <div>
            <div className="challenge-detail-title-row">
              <h1>{challenge.title}</h1>

              <span
                className={`challenge-level ${challenge.difficulty.toLowerCase()}`}
              >
                <span className="challenge-level-dot" />
                {challenge.difficulty}
              </span>
            </div>

            <p>{challenge.description}</p>
          </div>

          <div className="challenge-detail-meta">
            <span>⏱ {getEstimatedTime(challenge.difficulty)}</span>
            <span>⭐ {getXpReward(challenge.difficulty)}</span>
          </div>
        </header>

        <div className="challenge-workspace">
          <section className="challenge-information-panel">
            <div className="challenge-panel-heading">
              <div>
                <span className="challenge-panel-label">Challenge</span>
                <h2>Instructions</h2>
              </div>
            </div>

            <div className="challenge-instructions">
              <p>{challenge.description}</p>
            </div>

            <div className="challenge-info-box">
              <span className="challenge-info-label">Your task</span>

              <p>
                Complete the starter function and submit your solution. Your
                code will be checked against multiple automated tests.
              </p>
            </div>

            {challenge.hint && (
              <div className="challenge-hint-section">
                <button
                  type="button"
                  className={
                    showHint
                      ? "challenge-hint-button active"
                      : "challenge-hint-button"
                  }
                  onClick={() => setShowHint((previous) => !previous)}
                >
                  {showHint ? "Hide Hint" : "💡 Show Hint"}
                </button>

                {showHint && (
                  <div className="challenge-hint-box">
                    <span>Hint</span>
                    <p>{challenge.hint}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="challenge-editor-panel">
            <div className="challenge-editor-header">
              <div>
                <span className="challenge-panel-label">JavaScript</span>
                <h2>Code Editor</h2>
              </div>

              <button
                type="button"
                className="challenge-reset-code-button"
                onClick={handleResetCode}
                disabled={submitting}
              >
                Reset Code
              </button>
            </div>

            <div className="challenge-editor-window">
              <div className="challenge-editor-toolbar">
                <div className="editor-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <span>solution.js</span>
              </div>

              <div className="challenge-monaco-editor">
                <Editor
                  height="430px"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  loading={
                    <div className="editor-loading">
                      Loading code editor...
                    </div>
                  }
                  options={{
                    automaticLayout: true,
                    bracketPairColorization: {
                      enabled: true,
                    },
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    fontFamily:
                      '"Cascadia Code", "Fira Code", Consolas, monospace',
                    fontLigatures: true,
                    fontSize: 15,
                    formatOnPaste: true,
                    insertSpaces: true,
                    lineHeight: 24,
                    lineNumbers: "on",
                    minimap: {
                      enabled: false,
                    },
                    padding: {
                      top: 18,
                      bottom: 18,
                    },
                    quickSuggestions: true,
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    suggestOnTriggerCharacters: true,
                    tabSize: 2,
                    wordWrap: "on",
                  }}
                />
              </div>
            </div>

            <div className="challenge-submit-row">
              <span className="challenge-submit-note">
                Your solution will run against the challenge tests.
              </span>

              <button
                type="button"
                className="challenge-submit-button"
                onClick={handleSubmit}
                disabled={submitting || code.trim() === ""}
              >
                {submitting ? (
                  <span className="challenge-submitting-content">
                    <span className="challenge-submit-spinner" />
                    Running Tests...
                  </span>
                ) : (
                  "Submit Solution →"
                )}
              </button>
            </div>
          </section>
        </div>

        <section className="challenge-results-panel">
          <div className="challenge-results-header">
            <div>
              <span className="challenge-panel-label">Output</span>
              <h2>Test Results</h2>
            </div>

            {result && (
              <span
                className={
                  result.passed
                    ? "challenge-result-status passed"
                    : "challenge-result-status failed"
                }
              >
                {result.passed ? "Passed" : "Failed"}
              </span>
            )}
          </div>

          {!result && (
            <div className="challenge-results-empty">
              <span>⌨</span>

              <div>
                <h3>No test results yet</h3>
                <p>Write your solution and submit it to see the results.</p>
              </div>
            </div>
          )}

          {result && (
            <div
              className={
                result.passed
                  ? "challenge-result-card passed result-animate"
                  : "challenge-result-card failed result-animate"
              }
            >
              <div className="challenge-result-icon">
                {result.passed ? "✓" : "!"}
              </div>

              <div className="challenge-result-content">
                <h3>
                  {result.passed
                    ? "All tests passed"
                    : result.requestError
                      ? "Submission error"
                      : "Some tests failed"}
                </h3>

                <p>
                  {result.message ||
                    (result.passed
                      ? "Passed! Nice work."
                      : "Your code ran, but one or more tests failed.")}
                </p>

                {!result.passed &&
                  result.input !== undefined &&
                  !result.requestError && (
                    <div className="challenge-result-detail">
                      <span>
                        {result.testNumber
                          ? `Failed Test Case ${result.testNumber}`
                          : "Input"}
                      </span>

                      <code>
                        {JSON.stringify(
                          result.input?.length === 1
                            ? result.input[0]
                            : result.input
                        )}
                      </code>
                    </div>
                  )}

                {!result.passed &&
                  result.error &&
                  !result.requestError && (
                    <div className="challenge-result-detail">
                      <span>Error</span>
                      <code>{result.error}</code>
                    </div>
                  )}

                {!result.passed &&
                  result.expected !== undefined &&
                  result.actual !== undefined && (
                    <div className="challenge-comparison">
                      <div>
                        <span>Expected</span>
                        <code>{String(result.expected)}</code>
                      </div>

                      <div>
                        <span>Actual</span>
                        <code>{String(result.actual)}</code>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </section>

        <div className="challenge-detail-footer">
          <Link to="/dashboard">
            <button
              type="button"
              className="challenge-dashboard-button"
            >
              Back to Dashboard
            </button>
          </Link>

          <Link to="/challenges">
            <button type="button" className="challenge-next-button">
              Browse More Challenges →
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ChallengeDetail;