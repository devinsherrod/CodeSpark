// tests/streak.test.js
// Unit tests for the pure calculateStreak() helper. No DB, no Express —
// just checking the date math is right, since this is the trickiest
// logic in the M3 progress feature.

const { calculateStreak } = require("../utils/streak");

// Fixed "today" so tests don't depend on when they're actually run.
const REFERENCE = new Date("2026-07-17T12:00:00Z");

describe("calculateStreak", () => {
  test("returns 0 when there are no active days", () => {
    expect(calculateStreak([], REFERENCE)).toBe(0);
  });

  test("returns 1 when the only active day is today", () => {
    expect(calculateStreak(["2026-07-17"], REFERENCE)).toBe(1);
  });

  test("returns 1 when the only active day is yesterday", () => {
    expect(calculateStreak(["2026-07-16"], REFERENCE)).toBe(1);
  });

  test("counts consecutive days ending today", () => {
    const days = ["2026-07-17", "2026-07-16", "2026-07-15", "2026-07-14"];
    expect(calculateStreak(days, REFERENCE)).toBe(4);
  });

  test("counts consecutive days ending yesterday (hasn't done today's yet)", () => {
    const days = ["2026-07-16", "2026-07-15", "2026-07-14"];
    expect(calculateStreak(days, REFERENCE)).toBe(3);
  });

  test("stops counting at the first gap", () => {
    // Active today, yesterday, and the day before — then a gap, then
    // more activity further back. Streak should stop at the gap.
    const days = ["2026-07-17", "2026-07-16", "2026-07-15", "2026-07-10", "2026-07-09"];
    expect(calculateStreak(days, REFERENCE)).toBe(3);
  });

  test("returns 0 when last activity was more than a day ago", () => {
    const days = ["2026-07-10", "2026-07-09", "2026-07-08"];
    expect(calculateStreak(days, REFERENCE)).toBe(0);
  });

  test("de-duplicates multiple submissions on the same day", () => {
    // Same day appearing twice shouldn't inflate the streak.
    const days = ["2026-07-17", "2026-07-17", "2026-07-16"];
    expect(calculateStreak(days, REFERENCE)).toBe(2);
  });

  test("handles Date objects, not just strings", () => {
    const days = [new Date("2026-07-17T09:00:00Z"), new Date("2026-07-16T20:00:00Z")];
    expect(calculateStreak(days, REFERENCE)).toBe(2);
  });
});
