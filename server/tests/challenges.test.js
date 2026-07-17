// tests/challenges.test.js
// Jest tests for the CodeSpark Challenges API.

const request = require("supertest");
const app = require("../index");

// Mock the database so tests do not need a real MySQL connection.
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../config/db");

describe("Challenges API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Checks that all challenges are returned.
  test("GET /api/challenges returns all challenges", async () => {
    pool.query.mockResolvedValueOnce([
      [
        { id: 1, title: "Hello World", difficulty: "Easy" },
        { id: 2, title: "Variables", difficulty: "Easy" },
      ],
    ]);

    const res = await request(app).get("/api/challenges");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0].title).toBe("Hello World");
  });

  // Checks that one challenge is returned by ID.
  test("GET /api/challenges/:id returns one challenge", async () => {
    pool.query.mockResolvedValueOnce([
      [
        {
          id: 1,
          title: "Hello World",
          difficulty: "Easy",
          description: "Print Hello World",
          starter_code: "console.log();",
        },
      ],
    ]);

    const res = await request(app).get("/api/challenges/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.title).toBe("Hello World");
  });

  // Checks that a missing challenge returns 404.
  test("GET /api/challenges/:id returns 404 if not found", async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get("/api/challenges/999");

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Challenge not found");
  });

  // Checks that a database error while listing challenges returns 500
  // instead of crashing the server.
  test("GET /api/challenges returns 500 on database error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    pool.query.mockRejectedValueOnce(new Error("Database Error"));

    const res = await request(app).get("/api/challenges");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch challenges");

    consoleSpy.mockRestore();
  });

  // Checks that a database error while fetching one challenge returns 500.
  test("GET /api/challenges/:id returns 500 on database error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    pool.query.mockRejectedValueOnce(new Error("Database Error"));

    const res = await request(app).get("/api/challenges/1");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch challenge");

    consoleSpy.mockRestore();
  });
});