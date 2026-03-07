import { Platform } from "react-native";

// Firebase is optional — install @react-native-firebase/app and
// @react-native-firebase/analytics, then add GoogleService-Info.plist
// and the plugin to app.json to enable.
// See: https://rnfirebase.io/

let analytics: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  analytics = require("@react-native-firebase/analytics").default;
} catch {
  // Firebase not installed — provider will be a no-op
}

export const firebaseProvider = {
  async initialize() {
    if (!analytics || Platform.OS === "web") return;
    await analytics().setAnalyticsCollectionEnabled(true);
  },

  track(event: string, properties?: Record<string, any>) {
    if (!analytics || Platform.OS === "web") return;
    analytics().logEvent(event, properties);
  },

  identify(userId: string, _traits?: Record<string, any>) {
    if (!analytics || Platform.OS === "web") return;
    analytics().setUserId(userId);
  },

  screen(name: string, properties?: Record<string, any>) {
    if (!analytics || Platform.OS === "web") return;
    analytics().logScreenView({
      screen_name: name,
      screen_class: name,
      ...properties,
    });
  },
};
