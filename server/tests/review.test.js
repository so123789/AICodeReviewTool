const request = require("supertest");
const app = require("../index");

async function registerAndLogin() {
  const user = { name: "Reviewer", email: "reviewer@example.com", password: "password123" };
  await request(app).post("/api/auth/register").send(user);
  const res = await request(app).post("/api/auth/login").send(user);
  return res.body.token;
}

describe("POST /api/review", () => {
  it("rejects requests with no auth token", async () => {
    const res = await request(app).post("/api/review").send({ code: "let x = 1;", language: "javascript" });
    expect(res.status).toBe(401);
  });

  it("rejects an unsupported language even when authenticated", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/review")
      .set("Authorization", `Bearer ${token}`)
      .send({ code: "console.log(1)", language: "brainfuck" });
    expect(res.status).toBe(400);
  });

  it("rejects empty code", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post("/api/review")
      .set("Authorization", `Bearer ${token}`)
      .send({ code: "   ", language: "javascript" });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/review/history", () => {
  it("requires authentication", async () => {
    const res = await request(app).get("/api/review/history");
    expect(res.status).toBe(401);
  });

  it("returns a paginated, empty history for a new user", async () => {
    const token = await registerAndLogin();
    const res = await request(app).get("/api/review/history").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.reviews).toEqual([]);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 20, total: 0 });
  });

  it("rejects an out-of-range limit", async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .get("/api/review/history?limit=999")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(400);
  });
});
