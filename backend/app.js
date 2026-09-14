import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import logger from "./src/config/logger.js";
import * as Sentry from "@sentry/node";
import errorHandler, { notFound } from "./src/middleware/error.middleware.js";
import { handleUploadError } from "./src/middleware/upload.middleware.js";
import { handlePaystackWebhook } from "./src/controllers/webhookController.js";

// Import routes
import authRoutes from "./src/routes/authRoutes.js";
import campaignRoutes from "./src/routes/campaignRoutes.js";
import donationRoutes from "./src/routes/donationRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import volunteerRoutes from "./src/routes/volunteerRoutes.js";
import blogsRoutes from "./src/routes/blogsRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";
import settingsRoutes from "./src/routes/settingsRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoute.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

const app = express();
const API_VERSION = process.env.API_VERSION || "v1";

app.use(cookieParser());

// CORS: Support multiple dev origins and prod origin
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.CLIENT_URL_PROD || "https://saboyouthfoundation.org",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // In production, reject requests with no origin to prevent CSRF-like
    // attacks from non-browser clients. Allow in dev for Postman etc.
    if (!origin) {
      if (process.env.NODE_ENV === "production") {
        return callback(new Error("CORS policy: Origin required"));
      }
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-App-Type"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// Paystack HMAC must run on the raw bytes. Register this BEFORE express.json().
app.post(
  `/api/${API_VERSION}/donations/webhook`,
  express.raw({ type: "application/json" }),
  handlePaystackWebhook,
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(mongoSanitize());

// ✅ Compression only for production
if (process.env.NODE_ENV === "production") app.use(compression());

// ✅ Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  logger.info("🧰 Morgan logging enabled (development mode)");
} else {
  app.use(morgan("combined", { stream: logger.stream }));
}

// ✅ Rate Limiting
if (process.env.NODE_ENV === "production") {
  const limiter = rateLimit({
    windowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);
}

// ✅ Auth limiter (safe for dev)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many authentication attempts, please try again later",
});

// ✅ Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ✅ Register routes (with selective limiter)
if (process.env.NODE_ENV !== "test") {
  app.use(`/api/${API_VERSION}/auth/login`, authLimiter);
  app.use(`/api/${API_VERSION}/auth/register`, authLimiter);
}
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/campaigns`, campaignRoutes);
app.use(`/api/${API_VERSION}/donations`, donationRoutes);
app.use(`/api/${API_VERSION}/events`, eventRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/volunteers`, volunteerRoutes);
app.use(`/api/${API_VERSION}/blogs`, blogsRoutes);
app.use(`/api/${API_VERSION}/newsletters`, newsletterRoutes);
app.use(`/api/${API_VERSION}/contact`, contactRoutes);
app.use(`/api/${API_VERSION}/payments`, paymentRoutes);
app.use(`/api/${API_VERSION}/settings`, settingsRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);

// ✅ Serve static files from uploads directory
const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

// ✅ Handle upload errors and global errors
// ✅ Sentry Error Handler (must be added after all controllers and before any other error middleware)
Sentry.setupExpressErrorHandler(app);

app.use(handleUploadError);
app.use(notFound);
app.use(errorHandler);

export default app;
