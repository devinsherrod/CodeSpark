// tests/progress.test.js
// Jest tests for the CodeSpark Progress API (M3).
// Mocks the database so no real MySQL connection is needed.

const request = require("supertest");
const app = require("../index");

jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");

describe("Progress API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/progress/:userId returns completed count, streak, and level", async () => {
    pool.query
      // COUNT(DISTINCT challenge_id) query
      .mockResolvedValueOnce([[{ count: 2 }]])
      // distinct completed difficulties query
      .mockResolvedValueOnce([[{ difficulty: "Easy" }, { difficulty: "Medium" }]])
      // distinct active days query
      .mockResolvedValueOnce([[{ day: "2026-07-17" }, { day: "2026-07-16" }]]);

    const res = await request(app).get("/api/progress/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.completedChallenges).toBe(2);
    expect(res.body.level).toBe("Medium"); // hardest difficulty completed
    expect(res.body.currentStreak).toBeGreaterThanOrEqual(0);
  });

  test("GET /api/progress/:userId returns level 'None' when nothing completed", async () => {
    pool.query
      .mockResolvedValueOnce([[{ count: 0 }]])
      .mockResolvedValueOnce([[]])
      .mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/progress/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.completedChallenges).toBe(0);
    expect(res.body.level).toBe("None");
    expect(res.body.currentStreak).toBe(0);
  });

  test("GET /api/progress/:userId returns 500 on database error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    pool.query.mockRejectedValueOnce(new Error("Database Error"));

    const res = await request(app).get("/api/progress/1");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch progress");

    consoleSpy.mockRestore();
  });
});
