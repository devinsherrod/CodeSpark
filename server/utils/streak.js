// utils/streak.js
// Pure function that turns a list of "days the user passed at least one
// challenge" into a current streak count. Kept separate from the route
// file so it can be unit tested directly without hitting the database.

function toDateString(d) {
  // Normalizes Date objects, "2026-07-17" strings, or full timestamps
  // down to a plain YYYY-MM-DD string so duplicate days collapse.
  return new Date(d).toISOString().slice(0, 10);
}

// days: array of dates (Date objects or strings), one per calendar day
// the user had at least one passing submission. Order doesn't matter —
// this function sorts them itself.
//
// Returns the number of consecutive days, counting backward from today,
// that the user has been active. If the most recent activity was more
// than a day ago (i.e. not today or yesterday), the streak is broken
// and this returns 0 — matching how most habit-tracker streaks work.
function calculateStreak(days, referenceDate = new Date()) {
  if (!days || days.length === 0) return 0;

  const dateStrings = [...new Set(days.map(toDateString))].sort().reverse();

  const today = new Date(referenceDate);
  today.setUTCHours(0, 0, 0, 0);

  const mostRecent = new Date(dateStrings[0] + "T00:00:00Z");
  const daysSinceLastActivity = Math.round((today - mostRecent) / 86400000);

  // More than 1 day since the last passing submission means the streak
  // is broken (0), not just "not extended today."
  if (daysSinceLastActivity > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dateStrings.length; i++) {
    const later = new Date(dateStrings[i - 1] + "T00:00:00Z");
    const earlier = new Date(dateStrings[i] + "T00:00:00Z");
    const gap = Math.round((later - earlier) / 86400000);

    if (gap === 1) {
      streak++;
    } else {
      break; // gap in activity — streak stops counting here
    }
  }

  return streak;
}

module.exports = { calculateStreak };
