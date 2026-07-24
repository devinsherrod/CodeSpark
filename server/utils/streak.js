/**
 * @file streak.js
 * @description
 * Provides utility functions for calculating a user's current
 * coding streak based on the days they successfully completed
 * coding challenges.
 */

/**
 * Converts a date value into a normalized YYYY-MM-DD string.
 *
 * This allows dates from different formats (Date objects,
 * timestamps, or strings) to be compared consistently.
 *
 * @param {Date|string} d - Date value to normalize.
 * @returns {string} Normalized date string in YYYY-MM-DD format.
 */
function toDateString(d) {
  return new Date(d).toISOString().slice(0, 10);
}

/**
 * Calculates the user's current consecutive-day streak.
 *
 * The streak counts consecutive calendar days, working backwards
 * from the reference date. If the user's last successful
 * submission was more than one day ago, the streak is considered
 * broken and the function returns 0.
 *
 * @param {Array<Date|string>} days - Dates on which the user completed at least one challenge.
 * @param {Date} [referenceDate=new Date()] - Date used as the current day.
 * @returns {number} Current streak length in days.
 */
function calculateStreak(days, referenceDate = new Date()) {
  if (!days || days.length === 0) return 0;

  const dateStrings = [...new Set(days.map(toDateString))].sort().reverse();

  const today = new Date(referenceDate);
  today.setUTCHours(0, 0, 0, 0);

  const mostRecent = new Date(dateStrings[0] + "T00:00:00Z");
  const daysSinceLastActivity = Math.round((today - mostRecent) / 86400000);

  if (daysSinceLastActivity > 1) return 0;

  let streak = 1;

  for (let i = 1; i < dateStrings.length; i++) {
    const later = new Date(dateStrings[i - 1] + "T00:00:00Z");
    const earlier = new Date(dateStrings[i] + "T00:00:00Z");
    const gap = Math.round((later - earlier) / 86400000);

    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Exports the streak calculation utility.
 */
module.exports = {
  calculateStreak,
};