import { Link } from "react-router-dom";

function Challenges() {
  return (
    <div className="app-page">
      <h1>Challenges</h1>

    <div>
        <p>Reverse String (Easy)</p>
        <p>FizzBuzz (Easy)</p>
        <p>Two Sum (Medium)</p>
    </div>
      <Link to="/challenge">
        <button>Open Challenge</button>
      </Link>
    </div>
  );
}

export default Challenges;