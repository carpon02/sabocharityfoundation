// IMPORTANT: This file must be imported FIRST in server.js
// Import with `import * as Sentry from "@sentry/node"` for ESM
import * as Sentry from "@sentry/node";
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions for development
  // Profiling
  profilesSampleRate: 1.0, // Profile 100% of sampled transactions
  // integrations: [nodeProfilingIntegration()],
  // Set sampling rate for performance monitoring in production
  environment: process.env.NODE_ENV || "development",
  // Send default PII data
  sendDefaultPii: true,
});

export default Sentry;
