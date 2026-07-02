const request = require("supertest");
const app = require("../index");

describe("CodeSpark API", () => {

  test("GET / should return API status", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "CodeSpark API running"
    });
  });

});