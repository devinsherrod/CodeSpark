import { Link } from "react-router-dom";

function ChallengeDetail() {
  return (
    <div className="app-page">
      <h1>Reverse String</h1>

      <p>Write a function that reverses a string.</p>

      <textarea
        rows="10"
        cols="50"
        placeholder="Write code here..."
      ></textarea>

      <br /><br />

      <button>Submit</button>

      <br /><br />

      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
}

export default ChallengeDetail;