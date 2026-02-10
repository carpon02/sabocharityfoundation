// src/utils/seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/database.js";

// Models
import User from "../models/User.js";
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Blog from "../models/Blog.js";
import Event from "../models/Event.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🧹 Clearing existing data...");
    await User.deleteMany();
    await Campaign.deleteMany();
    await Donation.deleteMany();
    await Blog.deleteMany();
    await Event.deleteMany();

    console.log("👤 Seeding Users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const adminEmail =
      process.env.ADMIN_EMAIL || "admin@saboyouthfoundation.org";
    const adminPassword = process.env.ADMIN_PASSWORD || "Qwerty123";
    const adminName = process.env.ADMIN_NAME || "Foundation Admin";

    const users = await User.create([
      {
        fullName: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword, // Will be hashed by pre-save hook
        role: "admin",
        isEmailVerified: true,
        isActive: true,
        bio: "Leading the mission for sustainable development in Ibadan.",
      },
      {
        fullName: "Abubakar Mukhtar",
        email: "mukhtar@example.com",
        password: "password123",
        role: "donor",
        isEmailVerified: true,
        isActive: true,
        bio: "Tech enthusiast and community advocate.",
      },
      {
        fullName: "Sarah Johnson",
        email: "sarah@example.com",
        password: "password123",
        role: "donor",
        isEmailVerified: true,
        isActive: true,
        bio: "Passionate about structural education and healthcare.",
      },
      {
        fullName: "David Adeleke",
        email: "david@example.com",
        password: "password123",
        role: "donor",
        isEmailVerified: true,
        isActive: true,
      },
    ]);

    const adminId = users[0]._id;
    const donor1Id = users[1]._id;
    const donor2Id = users[2]._id;

    console.log("📢 Seeding Campaigns...");
    const campaignData = [
      {
        title: "Ibadan Digital Learning Hub",
        description:
          "Building a state-of-the-art computer lab for public school students in the heart of Ibadan. This project aims to bridge the digital divide by providing access to high-speed internet, modern hardware, and professional coding instructors.",
        shortDescription: "Modern computer lab for underprivileged youth.",
        category: "education",
        targetAmount: 5000000,
        raisedAmount: 1250000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["education", "technology", "youth"],
        featured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=500&fit=crop",
            publicId: "seeder/edu1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Community Clean Water Initiative",
        description:
          "Drilling solar-powered boreholes in water-scarce areas of Sabo Community. Clean water is a fundamental right, and your support helps us eliminate waterborne diseases.",
        shortDescription: "Solar power boreholes for Sabo community.",
        category: "infrastructure",
        targetAmount: 2500000,
        raisedAmount: 850000,
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["water", "health", "infrastructure"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=800&h=500&fit=crop",
            publicId: "seeder/water1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Sabo Medical Outreach 2026",
        description:
          "Free health screenings, eye tests, and basic medications for elderly residents in our community. This initiative will provide comprehensive healthcare services to over 500 elderly citizens.",
        shortDescription: "Free healthcare for the elderly.",
        category: "health",
        targetAmount: 1500000,
        raisedAmount: 450000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["health", "elderly", "outreach"],
        urgent: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=500&fit=crop",
            publicId: "seeder/health1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Youth Skills Development Program",
        description:
          "Empowering young adults with vocational training in carpentry, tailoring, and computer skills. This program will help 200 youth gain employable skills and start their own businesses.",
        shortDescription: "Vocational training for unemployed youth.",
        category: "empowerment",
        targetAmount: 3000000,
        raisedAmount: 1200000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["empowerment", "youth", "skills"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
            publicId: "seeder/empower1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "School Feeding Program",
        description:
          "Providing nutritious meals to 500 primary school children daily. This program ensures children have access to at least one balanced meal per day, improving their concentration and academic performance.",
        shortDescription: "Daily meals for primary school children.",
        category: "food relief",
        targetAmount: 2000000,
        raisedAmount: 750000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["food", "children", "education"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop",
            publicId: "seeder/food1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Orphanage Support Initiative",
        description:
          "Supporting three local orphanages with monthly supplies including food, clothing, educational materials, and medical care. This ensures children in orphanages have access to basic needs and quality education.",
        shortDescription: "Monthly support for orphanage children.",
        category: "welfare",
        targetAmount: 1800000,
        raisedAmount: 600000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["welfare", "orphans", "children"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=500&fit=crop",
            publicId: "seeder/welfare1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Street Light Installation Project",
        description:
          "Installing solar-powered street lights in dark areas of Sabo community to improve safety and security. This project will install 100 street lights across 10 major streets.",
        shortDescription: "Solar street lights for community safety.",
        category: "infrastructure",
        targetAmount: 2200000,
        raisedAmount: 950000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["infrastructure", "safety", "solar"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1513828583688-c52616db4f4c?w=800&h=500&fit=crop",
            publicId: "seeder/infra1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Scholarship Fund for Bright Students",
        description:
          "Providing full scholarships to 50 brilliant but financially disadvantaged students to pursue secondary and tertiary education. This includes tuition, books, and living expenses.",
        shortDescription: "Educational scholarships for bright students.",
        category: "education",
        targetAmount: 4000000,
        raisedAmount: 1500000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["education", "scholarship", "students"],
        featured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
            publicId: "seeder/edu2",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Maternal Health Care Program",
        description:
          "Providing free antenatal care, delivery services, and postnatal support to expectant mothers in underserved communities. This program will serve 300 mothers over the next year.",
        shortDescription: "Free healthcare for expectant mothers.",
        category: "healthcare",
        targetAmount: 2800000,
        raisedAmount: 1100000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["health", "women", "maternal"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=500&fit=crop",
            publicId: "seeder/health2",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Community Library Renovation",
        description:
          "Renovating and equipping the Sabo Community Library with modern books, computers, and study spaces. This will create a conducive learning environment for students and adults.",
        shortDescription: "Modern library for community learning.",
        category: "education",
        targetAmount: 1800000,
        raisedAmount: 650000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["education", "library", "community"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop",
            publicId: "seeder/edu3",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Emergency Relief Fund",
        description:
          "Establishing a rapid response fund for emergency situations such as floods, fires, and other disasters. This fund will provide immediate assistance to affected families.",
        shortDescription: "Emergency assistance for disaster victims.",
        category: "emergency relief",
        targetAmount: 3500000,
        raisedAmount: 1400000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["emergency", "relief", "disaster"],
        urgent: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=500&fit=crop",
            publicId: "seeder/emergency1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Sports Equipment for Schools",
        description:
          "Providing sports equipment and facilities to 20 public schools. This includes footballs, basketballs, jerseys, and basic sports infrastructure to promote physical fitness among students.",
        shortDescription: "Sports equipment for school children.",
        category: "sports",
        targetAmount: 1200000,
        raisedAmount: 450000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["sports", "education", "youth"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=500&fit=crop",
            publicId: "seeder/sports1",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Women Entrepreneurship Training",
        description:
          "Training 150 women in business skills, financial management, and marketing. Graduates will receive seed funding to start their own small businesses.",
        shortDescription: "Business training and funding for women.",
        category: "empowerment",
        targetAmount: 2500000,
        raisedAmount: 980000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["empowerment", "women", "business"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=500&fit=crop",
            publicId: "seeder/empower2",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Clean Toilet Facilities Project",
        description:
          "Building modern, hygienic toilet facilities in 10 public schools and community centers. This will improve sanitation and reduce the spread of diseases.",
        shortDescription: "Modern toilets for schools and communities.",
        category: "infrastructure",
        targetAmount: 1600000,
        raisedAmount: 580000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["infrastructure", "sanitation", "health"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=500&fit=crop",
            publicId: "seeder/infra2",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Mental Health Awareness Campaign",
        description:
          "Organizing workshops and counseling sessions to raise awareness about mental health issues. This program will provide free counseling to 200 individuals and train 50 community health workers.",
        shortDescription: "Mental health support and awareness.",
        category: "health",
        targetAmount: 1900000,
        raisedAmount: 720000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["health", "mental", "awareness"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop",
            publicId: "seeder/health3",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Disability Support Program",
        description:
          "Providing wheelchairs, hearing aids, and other assistive devices to 100 persons with disabilities. Also includes skills training and job placement support.",
        shortDescription: "Support for persons with disabilities.",
        category: "welfare",
        targetAmount: 2200000,
        raisedAmount: 850000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["welfare", "disability", "support"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=500&fit=crop",
            publicId: "seeder/welfare2",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Agricultural Training Center",
        description:
          "Establishing a training center to teach modern farming techniques to 300 farmers. This includes training on organic farming, irrigation, and crop management.",
        shortDescription: "Modern farming skills for local farmers.",
        category: "empowerment",
        targetAmount: 3200000,
        raisedAmount: 1300000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["empowerment", "agriculture", "farming"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop",
            publicId: "seeder/empower3",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Mobile Health Clinic",
        description:
          "Operating a mobile health clinic that visits remote areas weekly to provide free medical consultations, vaccinations, and basic treatments to underserved communities.",
        shortDescription: "Mobile clinic for remote communities.",
        category: "healthcare",
        targetAmount: 2800000,
        raisedAmount: 1050000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["health", "mobile", "clinic"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1576091160550-2173dba999e8?w=800&h=500&fit=crop",
            publicId: "seeder/health4",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Youth Coding Bootcamp",
        description:
          "Intensive 6-month coding bootcamp for 50 young adults. Graduates will be equipped with web development, mobile app development, and software engineering skills.",
        shortDescription: "Intensive coding training for youth.",
        category: "education",
        targetAmount: 3500000,
        raisedAmount: 1400000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["education", "coding", "technology"],
        featured: true,
        images: [
          {
            url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop",
            publicId: "seeder/edu4",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Community Playground Construction",
        description:
          "Building safe, modern playgrounds in 5 neighborhoods to provide children with safe spaces to play and exercise. This will include swings, slides, and sports courts.",
        shortDescription: "Safe playgrounds for neighborhood children.",
        category: "infrastructure",
        targetAmount: 1400000,
        raisedAmount: 520000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["infrastructure", "children", "playground"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=500&fit=crop",
            publicId: "seeder/infra3",
            isPrimary: true,
          },
        ],
      },
      {
        title: "Elderly Care Support Program",
        description:
          "Providing monthly care packages, medical checkups, and social activities for 200 elderly citizens. This program ensures our seniors live with dignity and have access to essential services.",
        shortDescription: "Comprehensive care for elderly citizens.",
        category: "welfare",
        targetAmount: 2400000,
        raisedAmount: 900000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        status: "active",
        approved: true,
        createdBy: adminId,
        location: { city: "Ibadan", state: "Oyo", country: "Nigeria" },
        tags: ["welfare", "elderly", "care"],
        images: [
          {
            url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=500&fit=crop",
            publicId: "seeder/welfare3",
            isPrimary: true,
          },
        ],
      },
    ];

    const campaigns = await Campaign.create(campaignData);

    console.log("💰 Seeding Donations...");
    await Donation.create([
      {
        donor: donor2Id,
        campaign: campaigns[0]._id,
        amount: 50000,
        paymentMethod: "card",
        paymentReference: "REF-" + Date.now() + "1",
        status: "completed",
        approvalStatus: "approved",
        paymentVerified: true,
        anonymous: false,
        impactMessage: "Proud to support our future leaders!",
      },
      {
        donor: donor1Id,
        campaign: campaigns[1]._id,
        amount: 100000,
        paymentMethod: "bank_transfer",
        paymentReference: "REF-" + Date.now() + "2",
        status: "completed",
        approvalStatus: "approved",
        paymentVerified: true,
        anonymous: true,
      },
    ]);

    console.log("✍️ Seeding Blogs...");
    await Blog.create([
      {
        title: "The Impact of Digital Literacy in 2026",
        excerpt:
          "How technology is reshaping the educational landscape for Nigerian youth.",
        content:
          "<p>Digital literacy is no longer a luxury; it is a necessity. In our latest project, we explore how access to modern tools changes the life trajectory of students in Ibadan.</p>",
        category: "Impact Reports",
        author: adminId,
        status: "published",
        publishDate: new Date(),
        featured: true,
        tags: ["technology", "education", "impact"],
        featuredImage: {
          url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
          publicId: "seeder/blog1",
        },
      },
      {
        title: "Foundation Anniversary: 14 Years of Service",
        excerpt:
          "Reflecting on our journey from a small team to a community cornerstone.",
        content:
          "<p>Fourteen years ago, we started with a simple vision. Today, thanks to our transparency protocols and your support, we have impacted over 5,000 lives.</p>",
        category: "Announcements",
        author: adminId,
        status: "published",
        publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        tags: ["anniversary", "milestone"],
      },
    ]);

    console.log("📅 Seeding Events...");
    await Event.create([
      {
        title: "Youth Tech Summit 2026",
        description:
          "A gathering of young minds to discuss the future of tech in Nigeria.",
        category: "workshop",
        eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eventTime: { start: "09:00", end: "16:00" },
        location: { venue: "Sabo Community Center", city: "Ibadan" },
        status: "published",
        featured: true,
        createdBy: adminId,
      },
      {
        title: "Community Outreach: Health & Wellness",
        description:
          "Providing basic health checks and wellness advice to community members.",
        category: "community_outreach",
        eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        eventTime: { start: "10:00", end: "14:00" },
        location: { venue: "Liberty Stadium Area", city: "Ibadan" },
        status: "published",
        createdBy: adminId,
      },
      {
        title: "Volunteer Induction Program",
        description: "Training new volunteers for the upcoming quarter.",
        category: "volunteer_drive",
        eventDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        eventTime: { start: "11:00", end: "13:00" },
        location: { venue: "Virtual Hub", city: "Online" },
        status: "completed",
        createdBy: adminId,
      },
    ]);

    // Update campaign stats
    console.log("📊 Updating Campaign Stats...");
    for (const campaign of campaigns) {
      const c = await Campaign.findById(campaign._id);
      await c.updateDonationStats();
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
