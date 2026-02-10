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
      tracesSampleRate: 1.0, // Capture 100% of transactions for development
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      environment: import.meta.env.MODE || "development",
    });
  },

  error: (error, context = {}) => {
    console.error(error);
    Sentry.captureException(error, {
      extra: context,
    });
  },

  info: (message, context = {}) => {
    console.log(message);
    Sentry.captureMessage(message, {
      level: "info",
      extra: context,
    });
  },

  warn: (message, context = {}) => {
    console.warn(message);
    Sentry.captureMessage(message, {
      level: "warning",
      extra: context,
    });
  },
};

export default Logger;
