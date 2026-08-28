import request from "supertest";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import User from "../../src/models/User.js";

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "Test@123456",
        phone: "08012345678",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.fullName).toBe(userData.fullName);
      expect(response.body.data.token).toBeUndefined();
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([expect.stringMatching(/^token=/)]),
      );

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it("should reject registration with duplicate email", async () => {
      const userData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "Test@123456",
        phone: "08012345678",
      };

      // Create first user
      await request(app).post("/api/v1/auth/register").send(userData);

      // Try to create duplicate
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject registration with invalid email", async () => {
      const userData = {
        fullName: "Test User",
        email: "invalid-email",
        password: "Test@123456",
        phone: "08012345678",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject registration with weak password", async () => {
      const userData = {
        fullName: "Test User",
        email: "test@example.com",
        password: "123", // Too short
        phone: "08012345678",
      };

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app).post("/api/v1/auth/register").send({
        fullName: "Test User",
        email: "test@example.com",
        password: "Test@123456",
        phone: "08012345678",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "Test@123456",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@example.com");
      expect(response.body.data.token).toBeUndefined();
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([expect.stringMatching(/^token=/)]),
      );
    });

    it("should reject login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "WrongPassword123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject login with non-existent email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Test@123456",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/auth/profile", () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      const registerResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Test User",
          email: "test@example.com",
          password: "Test@123456",
          phone: "08012345678",
        });

      authToken = registerResponse.headers["set-cookie"];
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Cookie", authToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe("test@example.com");
    });

    it("should reject request without token", async () => {
      const response = await request(app).get("/api/v1/auth/me").expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
