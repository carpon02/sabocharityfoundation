import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/database.js";

dotenv.config({ path: "./.env" });

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Foundation Admin";

    if (!adminEmail || !adminPassword) {
      console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD not found in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({
      email: adminEmail.toLowerCase(),
    });

    if (existingAdmin) {
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
      // Update password just in case it changed in .env
      existingAdmin.password = adminPassword;
      existingAdmin.role = "admin";
      existingAdmin.adminRole = "super_admin";
      existingAdmin.isEmailVerified = true;
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log("✅ Admin credentials updated.");
    } else {
      await User.create({
        fullName: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: "admin",
        adminRole: "super_admin",
        isEmailVerified: true,
        isActive: true,
      });
      console.log(`✅ Admin user created successfully: ${adminEmail}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
