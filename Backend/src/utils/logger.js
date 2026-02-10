import winston from "winston";
import {
  init,
  httpIntegration,
  expressIntegration,
  expressErrorHandler,
  captureException,
} from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Define colors
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Custom format
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Transports
const transports = [new winston.transports.Console()];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Stream for Morgan
Logger.stream = {
  write: (message) => {
    Logger.http(message.trim());
  },
};

// Sentry Wrapper
export const SentryLogger = {
  init: (app) => {
    init({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        // enable HTTP calls tracing
        httpIntegration(),
        // enable Express.js middleware tracing
        expressIntegration({ app }),
        nodeProfilingIntegration(),
      ],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  },
  // In Sentry v8+, request/tracing are handled by expressIntegration automatically
  // We keep no-ops here if you prefer, but better to remove usage in server.js
  errorHandler: () => expressErrorHandler(),
  captureException: (error) => {
    Logger.error(error);
    captureException(error);
  },
};

export default Logger;
