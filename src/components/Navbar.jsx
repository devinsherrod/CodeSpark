import { NavLink, useNavigate } from "react-router-dom";

/**
 * Main navigation bar used throughout CodeSpark.
 *
 * @function Navbar
 * @returns {JSX.Element} The application navigation bar.
 */
function Navbar() {
  const navigate = useNavigate();

  /**
   * Returns the correct class for active navigation links.
   *
   * @param {Object} navData
   * @param {boolean} navData.isActive
   * @returns {string}
   */
  function getNavLinkClass({ isActive }) {
    return isActive
      ? "navbar-link navbar-link-active"
      : "navbar-link";
  }

  /**
   * Returns the user to the login page.
   */
  function handleLogout() {
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/dashboard" className="navbar-brand">
          <span className="navbar-brand-icon">{"</>"}</span>
          <span>CodeSpark</span>
        </NavLink>

        <nav className="navbar-links" aria-label="Main navigation">
          <NavLink to="/dashboard" className={getNavLinkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/challenges" className={getNavLinkClass}>
            Challenges
          </NavLink>

          <NavLink to="/progress" className={getNavLinkClass}>
            Progress
          </NavLink>
        </nav>

        <button
          type="button"
          className="navbar-logout-button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </header>
  );
}

export default Navbar;