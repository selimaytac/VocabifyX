import { Platform } from "react-native";
import { Adjust, AdjustConfig, AdjustEvent } from "react-native-adjust";

import { config } from "@/config";

export const adjustProvider = {
  async initialize() {
    if (!config.adjust.appToken || Platform.OS === "web") return;

    const adjustConfig = new AdjustConfig(
      config.adjust.appToken,
      config.isDev
        ? AdjustConfig.EnvironmentSandbox
        : AdjustConfig.EnvironmentProduction,
    );

    Adjust.initSdk(adjustConfig);
  },

  track(event: string, properties?: Record<string, any>) {
    if (!config.adjust.appToken || Platform.OS === "web") return;
    const adjustEvent = new AdjustEvent(event);
    if (properties) {
      Object.entries(properties).forEach(([key, value]) => {
        adjustEvent.addCallbackParameter(key, String(value));
      });
    }
    Adjust.trackEvent(adjustEvent);
  },

  identify(_userId: string, _traits?: Record<string, any>) {
    // Adjust uses device-based attribution, no user-level identify
  },

  screen(_name: string, _properties?: Record<string, any>) {
    // Adjust doesn't have a native screen tracking method
  },
};
