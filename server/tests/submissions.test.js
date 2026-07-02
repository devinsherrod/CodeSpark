// tests/submissions.test.js
// Jest tests for the CodeSpark Submissions API.
// These tests mock the database so a real MySQL server is not required.

const request = require("supertest");
const app = require("../index");

// Mock the database connection.
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");

describe("Submissions API", () => {
  // Reset mocks before each test.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Checks that a valid submission is accepted.
  test("POST /api/submissions creates a new submission", async () => {
    pool.query
      .mockResolvedValueOnce([[{ expected_output: "Hello World" }]])
      .mockResolvedValueOnce([{ insertId: 1 }]);

    const res = await request(app)
      .post("/api/submissions")
      .send({
        challengeId: 1,
        userId: 1,
        code: 'console.log("Hello World");',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.submissionId).toBe(1);
    expect(res.body.passed).toBe(true);
  });

  // Checks that missing required fields return a 400 error.
  test("POST /api/submissions returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/submissions")
      .send({
        challengeId: 1,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(
      "challengeId, userId, and code are required"
    );
  });

  // Checks that an invalid challenge ID returns a 404 error.
  test("POST /api/submissions returns 404 for an invalid challenge", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app)
      .post("/api/submissions")
      .send({
        challengeId: 999,
        userId: 1,
        code: "test",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Challenge not found");
  });

  // Checks that a user's submissions can be retrieved.
  test("GET /api/submissions/:userId returns user submissions", async () => {
    pool.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          challenge_id: 1,
          user_id: 1,
          passed: true,
        },
      ],
    ]);

    const res = await request(app).get("/api/submissions/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].user_id).toBe(1);
  });

  // Checks that a database error returns a 500 response.
  test("GET /api/submissions/:userId returns 500 on database error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    pool.query.mockRejectedValueOnce(new Error("Database Error"));

    const res = await request(app).get("/api/submissions/1");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch submissions");

    consoleSpy.mockRestore();
  });
});