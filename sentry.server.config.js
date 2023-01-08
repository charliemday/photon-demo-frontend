// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
console.log("Process.env.SENTRY_DSN", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      SENTRY_DSN ||
      "https://ce112f8a18904fb6a40d711c012ea1af@o383253.ingest.sentry.io/4504469452226560",
    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1.0,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
  });
}
