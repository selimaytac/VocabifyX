import { Platform } from "react-native";
import Purchases from "react-native-purchases";

import { config } from "@/config";

export const revenueCatProvider = {
  async configure() {
    if (config.isDev || Platform.OS === "web") return;

    const apiKey =
      Platform.OS === "ios"
        ? config.revenueCat.iosApiKey
        : config.revenueCat.androidApiKey;

    if (!apiKey) return;

    Purchases.configure({ apiKey });
  },

  async login(userId: string) {
    if (config.isDev || Platform.OS === "web") return;
    await Purchases.logIn(userId);
  },

  async logout() {
    if (config.isDev || Platform.OS === "web") return;
    await Purchases.logOut();
  },

  async setAttributes(attributes: Record<string, string>) {
    if (config.isDev || Platform.OS === "web") return;
    await Purchases.setAttributes(attributes);
  },

  async setAdjustId(adjustId: string) {
    if (config.isDev || Platform.OS === "web") return;
    await Purchases.setAdjustID(adjustId);
  },

  async getCustomerInfo() {
    if (config.isDev || Platform.OS === "web") return null;
    return await Purchases.getCustomerInfo();
  },

  async getOfferings() {
    if (config.isDev || Platform.OS === "web") return null;
    return await Purchases.getOfferings();
  },
};
