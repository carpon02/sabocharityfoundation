import request from "supertest";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import Campaign from "../../src/models/Campaign.js";
import Donation from "../../src/models/Donation.js";
import User from "../../src/models/User.js";

describe("Donation API Integration Tests", () => {
  let donorToken;
  let adminToken;
  let donorUser;
  let adminUser;
  let testCampaign;

  beforeAll(async () => {
    await dbHandler.connect();
  });

  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  beforeEach(async () => {
    // Create donor user
    const donorResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        fullName: "Test Donor",
        email: "donor@example.com",
        password: "Test@123456",
        phone: "08012345678",
      });
    donorUser = await User.findOne({ email: "donor@example.com" });
    const jwt = await import("jsonwebtoken");
    donorToken = jwt.default.sign(
      { id: donorUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "Admin@123456",
      phone: "08087654321",
      role: "admin",
      adminRole: "super_admin",
      isActive: true,
    });

    adminToken = jwt.default.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Create test campaign
    testCampaign = await Campaign.create({
      title: "Test Campaign",
      description: "Test campaign description for donation testing",
      shortDescription: "Test campaign",
      category: "education",
      targetAmount: 100000,
      raisedAmount: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "active",
      createdBy: adminUser._id,
      images: [
        {
          url: "https://example.com/image.jpg",
          publicId: "test-image",
          isPrimary: true,
        },
      ],
      location: {
        city: "Ibadan",
        state: "Oyo",
        country: "Nigeria",
      },
    });
  });

  describe("POST /api/v1/donations/initialize", () => {
    it("should initialize donation for authenticated user", async () => {
      const donationData = {
        campaignId: testCampaign._id.toString(),
        amount: 5000,
        paymentMethod: "card",
        anonymous: false,
      };

      const response = await request(app)
        .post("/api/v1/donations/initialize")
        .set("Authorization", `Bearer ${donorToken}`)
        .send(donationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donation.amount).toBe(5000);
      expect(response.body.data.payment).toBeDefined();
      expect(response.body.data.payment.authorizationUrl).toBeDefined();

      // Verify donation was created in database
      const donation = await Donation.findById(response.body.data.donation.id);
      expect(donation).toBeDefined();
      expect(donation.amount).toBe(5000);
      expect(donation.status).toBe("processing");
    });

    it("should initialize anonymous donation", async () => {
      const donationData = {
        campaignId: testCampaign._id.toString(),
        amount: 3000,
        paymentMethod: "card",
        anonymous: true,
        donorInfo: {
          firstName: "Anonymous",
          lastName: "Donor",
          email: "anon@example.com",
        },
      };

      const response = await request(app)
        .post("/api/v1/donations/initialize")
        .send(donationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donation.amount).toBe(3000);

      const donation = await Donation.findById(response.body.data.donation.id);
      expect(donation.anonymous).toBe(true);
    });

    it("should reject donation below minimum amount", async () => {
      const donationData = {
        campaignId: testCampaign._id.toString(),
        amount: 50, // Below minimum of 100
        paymentMethod: "card",
      };

      const response = await request(app)
        .post("/api/v1/donations/initialize")
        .set("Authorization", `Bearer ${donorToken}`)
        .send(donationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject donation to inactive campaign", async () => {
      testCampaign.status = "paused";
      await testCampaign.save();

      const donationData = {
        campaignId: testCampaign._id.toString(),
        amount: 5000,
        paymentMethod: "card",
      };

      const response = await request(app)
        .post("/api/v1/donations/initialize")
        .set("Authorization", `Bearer ${donorToken}`)
        .send(donationData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donations/my-donations", () => {
    beforeEach(async () => {
      // Create test donations
      await Donation.create([
        {
          donor: donorUser._id,
          campaign: testCampaign._id,
          amount: 5000,
          paymentMethod: "card",
          paymentReference: "REF-001",
          status: "completed",
          approvalStatus: "approved",
        },
        {
          donor: donorUser._id,
          campaign: testCampaign._id,
          amount: 3000,
          paymentMethod: "bank_transfer",
          paymentReference: "REF-002",
          status: "pending",
          approvalStatus: "pending",
        },
      ]);
    });

    it("should get user donations", async () => {
      const response = await request(app)
        .get("/api/v1/donations/my-donations")
        .set("Authorization", `Bearer ${donorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donations).toHaveLength(2);
      expect(response.body.data.stats.totalCount).toBe(2);
    });

    it("should filter donations by status", async () => {
      const response = await request(app)
        .get("/api/v1/donations/my-donations?status=completed")
        .set("Authorization", `Bearer ${donorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donations).toHaveLength(1);
      expect(response.body.data.donations[0].status).toBe("completed");
    });

    it("should paginate donations", async () => {
      const response = await request(app)
        .get("/api/v1/donations/my-donations?page=1&limit=1")
        .set("Authorization", `Bearer ${donorToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donations).toHaveLength(1);
      expect(response.body.data.pagination.total).toBe(2);
      expect(response.body.data.pagination.pages).toBe(2);
    });
  });

  describe("PUT /api/v1/donations/:id/approve (Admin)", () => {
    let testDonation;

    beforeEach(async () => {
      testDonation = await Donation.create({
        donor: donorUser._id,
        campaign: testCampaign._id,
        amount: 5000,
        paymentMethod: "card",
        paymentReference: "REF-TEST",
        status: "verified",
        approvalStatus: "pending",
        paymentVerified: true,
        verifiedAt: new Date(),
      });
    });

    it("should approve donation as admin", async () => {
      const response = await request(app)
        .put(`/api/v1/donations/${testDonation._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ adminNotes: "Approved for testing" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donation.approvalStatus).toBe("approved");
      expect(response.body.data.donation.status).toBe("completed");

      // Verify campaign was updated
      const updatedCampaign = await Campaign.findById(testCampaign._id);
      expect(updatedCampaign.raisedAmount).toBe(5000);
    });

    it("should reject approval without admin role", async () => {
      const response = await request(app)
        .put(`/api/v1/donations/${testDonation._id}/approve`)
        .set("Authorization", `Bearer ${donorToken}`)
        .send({ adminNotes: "Trying to approve" })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should reject approval of unverified payment", async () => {
      testDonation.paymentVerified = false;
      await testDonation.save();

      const response = await request(app)
        .put(`/api/v1/donations/${testDonation._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ adminNotes: "Trying to approve unverified" })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/donations/admin/all (Admin)", () => {
    beforeEach(async () => {
      await Donation.create([
        {
          donor: donorUser._id,
          campaign: testCampaign._id,
          amount: 5000,
          paymentMethod: "card",
          paymentReference: "REF-001",
          status: "completed",
          approvalStatus: "approved",
        },
        {
          donor: donorUser._id,
          campaign: testCampaign._id,
          amount: 3000,
          paymentMethod: "bank_transfer",
          paymentReference: "REF-002",
          status: "pending",
          approvalStatus: "pending",
        },
      ]);
    });

    it("should get all donations as admin", async () => {
      const response = await request(app)
        .get("/api/v1/donations/admin/all")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.donations).toHaveLength(2);
      expect(response.body.data.stats).toBeDefined();
    });

    it("should reject non-admin access", async () => {
      const response = await request(app)
        .get("/api/v1/donations/admin/all")
        .set("Authorization", `Bearer ${donorToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
