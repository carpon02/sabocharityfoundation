import dotenv from "dotenv";
import User from "../models/User.js";
import connectDB from "../config/database.js";
import bcrypt from "bcryptjs";

dotenv.config({ path: "./.env" });

const debugAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("🔍 Looking for admin:", adminEmail);
    console.log("🔍 Password from .env:", adminPassword);

    const user = await User.findOne({ email: adminEmail.toLowerCase() }).select("+password");

    if (!user) {
      console.log("❌ No user found with that email!");
      process.exit(1);
    }

    console.log("✅ User found:");
    console.log("   - _id:", user._id);
    console.log("   - fullName:", user.fullName);
    console.log("   - email:", user.email);
    console.log("   - role:", user.role);
    console.log("   - adminRole:", user.adminRole);
    console.log("   - isActive:", user.isActive);
    console.log("   - isEmailVerified:", user.isEmailVerified);
    console.log("   - authMethod:", user.authMethod);
    console.log("   - password exists:", !!user.password);
    console.log("   - password length:", user.password?.length);
    console.log("   - password starts with $2:", user.password?.startsWith("$2"));

    // Test comparePassword method
    console.log("\n🔐 Testing comparePassword method...");
    try {
      const result = await user.comparePassword(adminPassword);
      console.log("   comparePassword result:", result);
    } catch (err) {
      console.log("   comparePassword ERROR:", err.message);
    }

    // Test direct bcrypt compare
    console.log("\n🔐 Testing direct bcrypt.compare...");
    try {
      const result = await bcrypt.compare(adminPassword, user.password);
      console.log("   bcrypt.compare result:", result);
    } catch (err) {
      console.log("   bcrypt.compare ERROR:", err.message);
    }

    // If password isn't hashed, re-hash and save
    if (!user.password?.startsWith("$2")) {
      console.log("\n⚠️ Password is NOT hashed! Fixing...");
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(adminPassword, salt);
      await User.updateOne({ _id: user._id }, { $set: { password: hashed } });
      console.log("✅ Password re-hashed and saved directly.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Debug error:", error);
    process.exit(1);
  }
};

debugAdmin();
