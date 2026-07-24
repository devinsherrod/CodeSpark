/**
 * @file App.jsx
 * @description Defines the root React component and application routes
 * for the CodeSpark frontend.
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Challenges from "./pages/Challenges";
import ChallengeDetail from "./pages/ChallengeDetail";
import Progress from "./pages/Progress";
import "./App.css";

/**
 * Root component for the CodeSpark application.
 *
 * Configures client-side navigation and maps each URL path to its
 * corresponding page component.
 *
 * Available routes:
 * - `/` displays the login page.
 * - `/dashboard` displays the user dashboard.
 * - `/challenges` displays the list of coding challenges.
 * - `/challenge/:id` displays the details of a selected challenge.
 * - `/progress` displays the user's progress information.
 *
 * @function App
 * @returns {JSX.Element} The CodeSpark application router and page routes.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenge/:id" element={<ChallengeDetail />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;