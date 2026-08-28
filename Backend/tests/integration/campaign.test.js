import request from "supertest";
import app from "../../app.js";
import * as dbHandler from "../dbHandler.js";
import Campaign from "../../src/models/Campaign.js";
import User from "../../src/models/User.js";

describe("Campaign API Integration Tests", () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

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
    // Create admin user
    adminUser = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "Admin@123456",
      phone: "08087654321",
      role: "admin",
      adminRole: "super_admin",
      isActive: true,
    });

    const jwt = await import("jsonwebtoken");
    adminToken = jwt.default.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Create regular user
    const userResponse = await request(app).post("/api/v1/auth/register").send({
      fullName: "Regular User",
      email: "user@example.com",
      password: "User@123456",
      phone: "08012345678",
    });
    userToken = jwt.default.sign(
      { id: userResponse.body.data.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    regularUser = await User.findOne({ email: "user@example.com" });
  });

  describe("POST /api/v1/campaigns", () => {
    it("should create campaign as authenticated user", async () => {
      const campaignData = {
        title: "Education for All",
        description:
          "Providing quality education to underprivileged children in Ibadan",
        shortDescription: "Education campaign",
        category: "education",
        targetAmount: 500000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        location: {
          city: "Ibadan",
          state: "Oyo",
          country: "Nigeria",
        },
      };

      const response = await request(app)
        .post("/api/v1/campaigns/create-campaign")
        .set("Authorization", `Bearer ${userToken}`)
        .send(campaignData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.title).toBe(campaignData.title);
      expect(response.body.data.campaign.status).toBe("pending");

      const campaign = await Campaign.findById(response.body.data.campaign._id);
      expect(campaign).toBeDefined();
      expect(campaign.createdBy.toString()).toBe(regularUser._id.toString());
    });

    it("should reject campaign without authentication", async () => {
      const campaignData = {
        title: "Test Campaign",
        description: "Test description",
        category: "education",
        targetAmount: 100000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await request(app)
        .post("/api/v1/campaigns/create-campaign")
        .send(campaignData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it("should reject campaign with invalid category", async () => {
      const campaignData = {
        title: "Test Campaign",
        description: "Test description",
        category: "invalid-category",
        targetAmount: 100000,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await request(app)
        .post("/api/v1/campaigns/create-campaign")
        .set("Authorization", `Bearer ${userToken}`)
        .send(campaignData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject campaign with target amount below minimum", async () => {
      const campaignData = {
        title: "Test Campaign",
        description: "Test description",
        category: "education",
        targetAmount: 500, // Below minimum of 1000
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const response = await request(app)
        .post("/api/v1/campaigns/create-campaign")
        .set("Authorization", `Bearer ${userToken}`)
        .send(campaignData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/v1/campaigns", () => {
    beforeEach(async () => {
      // Create test campaigns
      await Campaign.create([
        {
          title: "Active Campaign 1",
          description: "Description 1",
          shortDescription: "Short 1",
          category: "education",
          targetAmount: 100000,
          raisedAmount: 50000,
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: "active",
          createdBy: adminUser._id,
          images: [
            {
              url: "https://example.com/img1.jpg",
              publicId: "img1",
              isPrimary: true,
            },
          ],
          location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        },
        {
          title: "Active Campaign 2",
          description: "Description 2",
          shortDescription: "Short 2",
          category: "health",
          targetAmount: 200000,
          raisedAmount: 100000,
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          status: "active",
          createdBy: adminUser._id,
          images: [
            {
              url: "https://example.com/img2.jpg",
              publicId: "img2",
              isPrimary: true,
            },
          ],
          location: { city: "Lagos", state: "Lagos", country: "Nigeria" },
        },
        {
          title: "Pending Campaign",
          description: "Description 3",
          shortDescription: "Short 3",
          category: "poverty",
          targetAmount: 150000,
          raisedAmount: 0,
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          status: "pending",
          createdBy: regularUser._id,
          images: [
            {
              url: "https://example.com/img3.jpg",
              publicId: "img3",
              isPrimary: true,
            },
          ],
          location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        },
      ]);
    });

    it("should get all active campaigns", async () => {
      const response = await request(app).get("/api/v1/campaigns").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns.length).toBeGreaterThan(0);
      // Should only return active campaigns by default
      response.body.data.campaigns.forEach((campaign) => {
        expect(campaign.status).toBe("active");
      });
    });

    it("should filter campaigns by category", async () => {
      const response = await request(app)
        .get("/api/v1/campaigns?category=education")
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.campaigns.forEach((campaign) => {
        expect(campaign.category).toBe("education");
      });
    });

    it("should paginate campaigns", async () => {
      const response = await request(app)
        .get("/api/v1/campaigns?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns).toHaveLength(1);
      expect(response.body.data.pagination.total).toBeGreaterThan(1);
    });

    it("should search campaigns by title", async () => {
      const response = await request(app)
        .get("/api/v1/campaigns?search=Active Campaign 1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaigns.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/campaigns/:id", () => {
    let testCampaign;

    beforeEach(async () => {
      testCampaign = await Campaign.create({
        title: "Test Campaign Details",
        description: "Detailed description",
        shortDescription: "Short description",
        category: "education",
        targetAmount: 100000,
        raisedAmount: 25000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        createdBy: adminUser._id,
        images: [
          {
            url: "https://example.com/img.jpg",
            publicId: "img",
            isPrimary: true,
          },
        ],
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
      });
    });

    it("should get campaign by ID", async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaign._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.title).toBe(testCampaign.title);
      expect(response.body.data.campaign.progressPercentage).toBe(25);
    });

    it("should get campaign by slug", async () => {
      const response = await request(app)
        .get(`/api/v1/campaigns/${testCampaign.slug}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.title).toBe(testCampaign.title);
    });

    it("should return 404 for non-existent campaign", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const response = await request(app)
        .get(`/api/v1/campaigns/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /api/v1/campaigns/:id/status (Admin)", () => {
    let testCampaign;

    beforeEach(async () => {
      testCampaign = await Campaign.create({
        title: "Pending Campaign",
        description: "Awaiting approval",
        shortDescription: "Short",
        category: "education",
        targetAmount: 100000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "pending",
        createdBy: regularUser._id,
        images: [
          {
            url: "https://example.com/img.jpg",
            publicId: "img",
            isPrimary: true,
          },
        ],
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
      });
    });

    it("should approve campaign as admin", async () => {
      const response = await request(app)
        .patch(`/api/v1/campaigns/${testCampaign._id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "active" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.campaign.status).toBe("active");

      const updatedCampaign = await Campaign.findById(testCampaign._id);
      expect(updatedCampaign.approved).toBe(true);
    });

    it("should reject approval without admin role", async () => {
      const response = await request(app)
        .patch(`/api/v1/campaigns/${testCampaign._id}/status`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ status: "active" })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/v1/campaigns/:id", () => {
    let userCampaign;

    beforeEach(async () => {
      userCampaign = await Campaign.create({
        title: "User Campaign",
        description: "Created by user",
        shortDescription: "Short",
        category: "education",
        targetAmount: 100000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "pending",
        createdBy: regularUser._id,
        images: [
          {
            url: "https://example.com/img.jpg",
            publicId: "img",
            isPrimary: true,
          },
        ],
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
      });
    });

    it("should delete own campaign", async () => {
      const response = await request(app)
        .delete(`/api/v1/campaigns/${userCampaign._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      const deletedCampaign = await Campaign.findById(userCampaign._id);
      expect(deletedCampaign).toBeNull();
    });

    it("should prevent deleting another user campaign", async () => {
      const otherUserResponse = await request(app)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Other User",
          email: "other@example.com",
          password: "Other@123456",
          phone: "08099999999",
        });

      const jwt = await import("jsonwebtoken");
      const otherToken = jwt.default.sign(
        { id: otherUserResponse.body.data.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );

      const response = await request(app)
        .delete(`/api/v1/campaigns/${userCampaign._id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    it("should allow admin to delete any campaign", async () => {
      const response = await request(app)
        .delete(`/api/v1/campaigns/${userCampaign._id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
