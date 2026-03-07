import {
  Identify,
  identify,
  init,
  track,
} from "@amplitude/analytics-react-native";

import { config } from "@/config";

export const amplitudeProvider = {
  async initialize() {
    if (!config.amplitude.apiKey) return;
    await init(config.amplitude.apiKey).promise;
  },

  track(event: string, properties?: Record<string, any>) {
    if (!config.amplitude.apiKey) return;
    track(event, properties);
  },

  identify(userId: string, traits?: Record<string, any>) {
    if (!config.amplitude.apiKey) return;
    const identifyEvent = new Identify();
    if (traits) {
      Object.entries(traits).forEach(([key, value]) => {
        identifyEvent.set(key, value);
      });
    }
    identify(identifyEvent, { user_id: userId });
  },

  screen(name: string, properties?: Record<string, any>) {
    if (!config.amplitude.apiKey) return;
    track("Screen Viewed", { screen_name: name, ...properties });
  },
};
