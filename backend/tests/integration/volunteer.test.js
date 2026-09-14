import request from "supertest";
import { jest } from "@jest/globals";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import User from "../../src/models/User.js";
import Volunteer from "../../src/models/Volunteer.js";
import generateToken from "../../src/utils/generateToken.js";

describe("Volunteer approve/reject flow", () => {
  let adminToken;
  let adminUser;
  let volunteer;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
    await dbHandler.connect();
  });

  beforeEach(async () => {
    // Create admin user
    adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
      adminRole: "super_admin",
      isEmailVerified: true,
    });
    adminToken = generateToken(adminUser._id);

    // Create a volunteer application
    volunteer = await Volunteer.create({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@test.com",
      phone: "+2348012345678",
      status: "pending",
      skills: ["teaching"],
      motivation: "Want to help the community",
      availability: "weekends",
    });
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  it("lists volunteers for admin", async () => {
    const res = await request(app)
      .get("/api/v1/volunteers")
      .set("Cookie", `token=${adminToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  it("approves a volunteer", async () => {
    const res = await request(app)
      .post(`/api/v1/volunteers/${volunteer._id}/approve`)
      .set("Cookie", `token=${adminToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);

    const updated = await Volunteer.findById(volunteer._id);
    expect(updated.status).toBe("approved");
  });

  it("rejects a volunteer", async () => {
    const res = await request(app)
      .post(`/api/v1/volunteers/${volunteer._id}/reject`)
      .set("Cookie", `token=${adminToken}`)
      .send({ rejectionReason: "Incomplete application" })
      .expect(200);

    expect(res.body.success).toBe(true);

    const updated = await Volunteer.findById(volunteer._id);
    expect(updated.status).toBe("rejected");
  });

  it("blocks unauthenticated access", async () => {
    await request(app)
      .get("/api/v1/volunteers")
      .expect(401);
  });

  it("blocks non-admin access", async () => {
    const donor = await User.create({
      fullName: "Donor User",
      email: "donor@test.com",
      password: "password123",
      role: "donor",
      isEmailVerified: true,
    });
    const donorToken = generateToken(donor._id);

    await request(app)
      .get("/api/v1/volunteers")
      .set("Cookie", `token=${donorToken}`)
      .expect(403);
  });
});
