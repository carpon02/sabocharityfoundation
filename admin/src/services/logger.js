import * as Sentry from "@sentry/react";

const Logger = {
  init: () => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
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
