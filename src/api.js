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
export const API_BASE_URL = "http://localhost:5050/api";

/**
 * Temporary user ID used until authentication is implemented.
 * @constant {number}
 */
export const CURRENT_USER_ID = 1;

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
  return request("/challenges");
}

/**
 * Retrieves information for a single coding challenge.
 *
 * @param {number|string} id - Unique identifier of the challenge.
 * @returns {Promise<Object>} Challenge details.
 */
export function getChallenge(id) {
  return request(`/challenges/${id}`);
}

/**
 * Submits a user's solution for a coding challenge.
 *
 * @param {number} challengeId - ID of the challenge being submitted.
 * @param {string} code - Source code entered by the user.
 * @returns {Promise<Object>} Submission result returned by the server.
 */
export function submitChallenge(challengeId, code) {
  return request("/submissions", {
    method: "POST",
    body: JSON.stringify({ challengeId, userId: CURRENT_USER_ID, code }),
  });
}

/**
 * Retrieves progress information for a user.
 *
 * @param {number} [userId=CURRENT_USER_ID] - User ID whose progress is requested.
 * @returns {Promise<Object>} User progress information.
 */
export function getProgress(userId = CURRENT_USER_ID) {
  return request(`/progress/${userId}`);
}