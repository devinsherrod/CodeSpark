import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChallenge, submitChallenge } from "../api";

function ChallengeDetail() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [code, setCode] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null); // null | { passed: boolean }
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit() {
    setSubmitting(true);
    setResult(null);
    try {
      const data = await submitChallenge(Number(id), code);
      setResult({ passed: data.passed });
    } catch {
      setResult({ error: true });
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

      <br /><br />

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

      {result && result.error && (
        <p className="result-text">Something went wrong submitting. Try again.</p>
      )}
      {result && !result.error && (
        <p className="result-text">
          {result.passed ? "Passed! Nice work." : "Not quite — try again."}
        </p>
      )}

      <br /><br />

      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default ChallengeDetail;
