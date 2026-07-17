// api.js
// Small shared helper so every page talks to the backend the same way,
// instead of each component hardcoding fetch() calls and URLs.
//
// No auth system yet (that's still M1/M4 scope), so we hardcode
// CURRENT_USER_ID for now — every page acts as if user 1 is logged in.
// Once auth is wired up, this is the one place that needs to change.

export const API_BASE_URL = "http://localhost:5050/api";

export const CURRENT_USER_ID = 1;

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

export function getChallenges() {
  return request("/challenges");
}

export function getChallenge(id) {
  return request(`/challenges/${id}`);
}

export function submitChallenge(challengeId, code) {
  return request("/submissions", {
    method: "POST",
    body: JSON.stringify({ challengeId, userId: CURRENT_USER_ID, code }),
  });
}

export function getProgress(userId = CURRENT_USER_ID) {
  return request(`/progress/${userId}`);
}
