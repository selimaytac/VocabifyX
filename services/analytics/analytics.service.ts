import { adjustProvider } from "./providers/adjust.provider";
import { amplitudeProvider } from "./providers/amplitude.provider";
import { firebaseProvider } from "./providers/firebase.provider";
import { sentryProvider } from "./providers/sentry.provider";

interface AnalyticsProvider {
  initialize: () => Promise<void>;
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  screen: (name: string, properties?: Record<string, any>) => void;
}

const providers: AnalyticsProvider[] = [
  firebaseProvider,
  amplitudeProvider,
  adjustProvider,
  sentryProvider,
];

export const analyticsService = {
  async initialize() {
    await Promise.allSettled(providers.map((p) => p.initialize()));
  },

  track(event: string, properties?: Record<string, any>) {
    providers.forEach((p) => {
      try {
        p.track(event, properties);
      } catch {
        // silently fail
      }
    });
  },

  identify(userId: string, traits?: Record<string, any>) {
    providers.forEach((p) => {
      try {
        p.identify(userId, traits);
      } catch {
        // silently fail
      }
    });
  },

  screen(name: string, properties?: Record<string, any>) {
    providers.forEach((p) => {
      try {
        p.screen(name, properties);
      } catch {
        // silently fail
      }
    });
  },
};
