import { config } from "@/config";

// Sentry is optional — install @sentry/react-native and add
// the plugin to app.json to enable.
// See: https://docs.sentry.io/platforms/react-native/

let Sentry: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Sentry = require("@sentry/react-native");
} catch {
  // Sentry not installed — provider will be a no-op
}

export const sentryProvider = {
  async initialize() {
    if (!Sentry || !config.sentry.dsn) return;

    Sentry.init({
      dsn: config.sentry.dsn,
      debug: config.isDev,
      tracesSampleRate: config.isDev ? 1.0 : 0.2,
      environment: config.isDev ? "development" : "production",
    });
  },

  track(event: string, properties?: Record<string, any>) {
    if (!Sentry || !config.sentry.dsn) return;
    Sentry.addBreadcrumb({
      category: "analytics",
      message: event,
      data: properties,
      level: "info",
    });
  },

  identify(userId: string, traits?: Record<string, any>) {
    if (!Sentry || !config.sentry.dsn) return;
    Sentry.setUser({ id: userId, ...traits });
  },

  screen(name: string, properties?: Record<string, any>) {
    if (!Sentry || !config.sentry.dsn) return;
    Sentry.addBreadcrumb({
      category: "navigation",
      message: name,
      data: properties,
      level: "info",
    });
  },
};
