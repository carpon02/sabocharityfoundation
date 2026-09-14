import winston from "winston";
import * as Sentry from "@sentry/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  }),
);

// Create logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// Add file transports only if not in production or logs dir exists
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  );

  logger.add(
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  );
}

// Stream for Morgan HTTP logger
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Custom error method to capture exceptions in Sentry automatically
const originalError = logger.error;
logger.error = (message, ...meta) => {
  if (message instanceof Error) {
    Sentry.captureException(message);
  } else if (typeof message === "string") {
    // If it's a string that looks like an error or if explicit error meta is provided
    Sentry.captureMessage(message, "error");
  }
  return originalError.call(logger, message, ...meta);
};

export default logger;
