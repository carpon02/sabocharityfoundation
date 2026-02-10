import * as Sentry from "@sentry/react";

const Logger = {
  init: () => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of the transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  },
  error: (error, context = {}) => {
    console.error(error);
    Sentry.captureException(error, { extra: context });
  },
  info: (message, context = {}) => {
    console.info(message);
    Sentry.addBreadcrumb({
      category: "info",
      message: message,
      level: "info",
      data: context,
    });
  },
  warn: (message, context = {}) => {
    console.warn(message);
    Sentry.addBreadcrumb({
      category: "warning",
      message: message,
      level: "warning",
      data: context,
    });
  },
};

export default Logger;
