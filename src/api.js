/**
 * @file api.js
 * @description
 * Provides helper functions for communicating with the CodeSpark backend API.
 * All frontend pages use these functions to retrieve challenges, submit
 * solutions, and view user progress.
 */

/**
 * Base URL of the CodeSpark backend API.
 * @constant {string}
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://codespark-api-949436063213.us-central1.run.app/api";

/**
 * Retrieves the currently logged-in user's ID from local storage.
 *
 * @returns {number} Logged-in user's ID.
 * @throws {Error} Throws an error when no user is logged in.
 */
export function getCurrentUserId() {
  const storedUserId = localStorage.getItem("userId");
  const userId = Number(storedUserId);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Please log in before continuing.");
  }

  return userId;
}

/**
 * Sends an HTTP request to the backend API.
 *
 * @param {string} path - API endpoint path beginning with "/".
 * @param {Object} [options={}] - Fetch request options.
 * @returns {Promise<Object>} Parsed JSON response from the server.
 * @throws {Error} Throws an error if the request is unsuccessful.
 */
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Retrieves all available coding challenges.
 *
 * @returns {Promise<Object[]>} A list of coding challenges.
 */
export function getChallenges() {
  const userId = getCurrentUserId();
  return request(`/challenges?userId=${userId}`);
}

export function getChallenge(id) {
  return request(`/challenges/${id}`);
}

/**
 * Retrieves information for a single coding challenge.
 *
 * @param {number|string} id - Unique identifier of the challenge.
 * @returns {Promise<Object>} Challenge details.
 */


/**
 * Submits a user's solution for a coding challenge.
 *
 * @param {number} challengeId - ID of the challenge being submitted.
 * @param {string} code - Source code entered by the user.
 * @returns {Promise<Object>} Submission result returned by the server.
 */
export function submitChallenge(challengeId, code) {
  const userId = getCurrentUserId();

  return request("/submissions", {
    method: "POST",
    body: JSON.stringify({ challengeId, userId, code }),
  });
}

/**
 * Retrieves progress information for a user.
 *
 * @param {number} [userId=CURRENT_USER_ID] - User ID whose progress is requested.
 * @returns {Promise<Object>} User progress information.
 */
export function getProgress(userId = getCurrentUserId()) {
  return request(`/progress/${userId}`);
}

/**
 * Creates a new user account.
 *
 * @param {Object} account - New account information.
 * @param {string} account.name - User's name.
 * @param {string} account.email - User's email.
 * @param {string} account.password - User's password.
 * @returns {Promise<Object>} Created user information.
 */
export function signupUser({ name, email, password }) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Logs in an existing user.
 *
 * @param {Object} credentials - Login credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - User's password.
 * @returns {Promise<Object>} Logged-in user information.
 */
export function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}