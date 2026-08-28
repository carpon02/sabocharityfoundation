import request from "supertest";
import { jest } from "@jest/globals";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import User from "../../src/models/User.js";
import generateToken from "../../src/utils/generateToken.js";

describe("Admin RBAC — authorizeAdminRole", () => {
  let superAdminToken, financeToken, contentToken, donorToken;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
    await dbHandler.connect();
  });

  beforeEach(async () => {
    const superAdmin = await User.create({
      fullName: "Super Admin",
      email: "super@test.com",
      password: "password123",
      role: "admin",
      adminRole: "super_admin",
      isEmailVerified: true,
    });
    superAdminToken = generateToken(superAdmin._id);

    const financeAdmin = await User.create({
      fullName: "Finance Admin",
      email: "finance@test.com",
      password: "password123",
      role: "admin",
      adminRole: "finance_admin",
      isEmailVerified: true,
    });
    financeToken = generateToken(financeAdmin._id);

    const contentEditor = await User.create({
      fullName: "Content Editor",
      email: "content@test.com",
      password: "password123",
      role: "admin",
      adminRole: "content_editor",
      isEmailVerified: true,
    });
    contentToken = generateToken(contentEditor._id);

    const donor = await User.create({
      fullName: "Donor User",
      email: "donor@test.com",
      password: "password123",
      role: "donor",
      isEmailVerified: true,
    });
    donorToken = generateToken(donor._id);
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  // ── Payment routes require finance_admin ─────────────────────
  describe("Payment routes (finance_admin)", () => {
    it("super_admin can access payments", async () => {
      const res = await request(app)
        .get("/api/v1/payments/admin/all")
        .set("Cookie", `token=${superAdminToken}`);

      // 200 = accessible (may be empty data)
      expect(res.status).toBe(200);
    });

    it("finance_admin can access payments", async () => {
      const res = await request(app)
        .get("/api/v1/payments/admin/all")
        .set("Cookie", `token=${financeToken}`);

      expect(res.status).toBe(200);
    });

    it("content_editor is blocked from payments", async () => {
      const res = await request(app)
        .get("/api/v1/payments/admin/all")
        .set("Cookie", `token=${contentToken}`);

      expect(res.status).toBe(403);
    });

    it("donor is blocked from payments", async () => {
      const res = await request(app)
        .get("/api/v1/payments/admin/all")
        .set("Cookie", `token=${donorToken}`);

      expect(res.status).toBe(403);
    });
  });

  // ── Analytics routes with mixed roles ────────────────────────
  describe("Analytics routes (role-specific)", () => {
    it("finance_admin can access donation trends", async () => {
      const res = await request(app)
        .get("/api/v1/analytics/donations")
        .set("Cookie", `token=${financeToken}`);

      expect(res.status).toBe(200);
    });

    it("content_editor is blocked from donation trends", async () => {
      const res = await request(app)
        .get("/api/v1/analytics/donations")
        .set("Cookie", `token=${contentToken}`);

      expect(res.status).toBe(403);
    });

    it("content_editor can access campaign analytics", async () => {
      const res = await request(app)
        .get("/api/v1/analytics/campaigns")
        .set("Cookie", `token=${contentToken}`);

      expect(res.status).toBe(200);
    });

    it("finance_admin is blocked from campaign analytics", async () => {
      const res = await request(app)
        .get("/api/v1/analytics/campaigns")
        .set("Cookie", `token=${financeToken}`);

      expect(res.status).toBe(403);
    });

    it("super_admin bypasses all role checks", async () => {
      // super_admin can access both finance and content routes
      const donationsRes = await request(app)
        .get("/api/v1/analytics/donations")
        .set("Cookie", `token=${superAdminToken}`);
      expect(donationsRes.status).toBe(200);

      const campaignsRes = await request(app)
        .get("/api/v1/analytics/campaigns")
        .set("Cookie", `token=${superAdminToken}`);
      expect(campaignsRes.status).toBe(200);
    });

    it("overview analytics is public (no auth required)", async () => {
      const res = await request(app)
        .get("/api/v1/analytics/overview");

      expect(res.status).toBe(200);
    });
  });
});
