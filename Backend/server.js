// IMPORTANT: Import instrument.js FIRST to initialize Sentry
import "./instrument.js";

import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import * as Sentry from "@sentry/node";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./src/config/database.js";
import logger from "./src/config/logger.js";
import initRecurringDonationCron from "./src/jobs/donationCron.js";

// Health check is now managed in app.js

// --------------------
// Environment Variables
// --------------------
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || "development";
const API_VERSION = process.env.API_VERSION || "v1";

// Validate required environment variables
const requiredEnv = [
  "MONGODB_URI",
  "JWT_SECRET",
  "PAYSTACK_SECRET_KEY",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_CLOUD_NAME",
];

requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    logger.error(`❌ Missing required environment variable: ${key}`);
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

logger.info("✅ All required environment variables are loaded");

// --------------------
// Global variables
// --------------------
let server;

// --------------------
// Debug middleware (development only)
// --------------------
if (ENV === "development") {
  app.use((req, res, next) => {
    console.log("🟢 Incoming Request:", req.method, req.originalUrl);
    if (Object.keys(req.body || {}).length > 0) {
      console.log("📦 Body:", req.body);
    }
    next();
  });
}

// --------------------
// Fatal Error Handler
// --------------------
const handleFatalError = async (err, source = "Unknown") => {
  logger.error(`💥 ${source} Error: ${err.message}`);
  console.error(`💥 ${source} Error: ${err.message}`);
  console.error(err.stack);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      logger.warn("🧩 MongoDB connection closed");
      console.warn("🧩 MongoDB connection closed");
      process.exit(1);
    });
  } else {
    await mongoose.connection.close(false);
    process.exit(1);
  }
};

// --------------------
// Start Server
// --------------------
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    logger.info("✅ MongoDB connected successfully");
    console.log("✅ MongoDB connected successfully");

    // Initialize background cron jobs
    initRecurringDonationCron();

    // Start Express server
    server = app.listen(PORT, () => {
      console.log("\n-----------------------------------------");
      console.log(`🚀 Server running in ${ENV.toUpperCase()} mode`);
      console.log(`🌍 Listening on: http://localhost:${PORT}`);
      console.log(`🧩 API root: http://localhost:${PORT}/api/${API_VERSION}`);
      console.log("-----------------------------------------\n");
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (err) {
    handleFatalError(err, "Server Startup");
  }
};

// --------------------
// Graceful Shutdown
// --------------------
const gracefulShutdown = async (signal) => {
  logger.info(`⚠️ ${signal} received. Gracefully shutting down...`);
  console.log(`⚠️ ${signal} received. Gracefully shutting down...`);

  if (server) {
    server.close(async () => {
      logger.info("🛑 HTTP server closed");
      console.log("🛑 HTTP server closed");
      await mongoose.connection.close(false);
      logger.info("🧩 MongoDB connection closed");
      console.log("🧩 MongoDB connection closed");
      process.exit(0);
    });
  } else {
    await mongoose.connection.close(false);
    process.exit(0);
  }
};

// Sentry Error Handler is now managed in app.js

// --------------------
// Event Listeners
// --------------------
process.on("unhandledRejection", (err) =>
  handleFatalError(err, "Unhandled Rejection"),
);
process.on("uncaughtException", (err) =>
  handleFatalError(err, "Uncaught Exception"),
);
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// --------------------
// Start the server
// --------------------
startServer();

// ✅ Export for testing/harmony (if called from elsewhere)
export default server;
