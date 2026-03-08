import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { TamaguiProvider } from "tamagui";

import { AchievementUnlockModal } from "@/components/AchievementUnlockModal";
import { LevelUpModal } from "@/components/LevelUpModal";
import { messages as enMessages } from "@/locales/en/messages";
import { messages as trMessages } from "@/locales/tr/messages";
import { analyticsService } from "@/services/analytics/analytics.service";
import { revenueCatProvider } from "@/services/analytics/providers/revenuecat.provider";
import { queryClient } from "@/services/api/client";
import { useLanguageStore } from "@/store/languageStore";
import tamaguiConfig from "@/tamagui.config";

const localeMessages: Record<string, Record<string, string>> = {
  en: enMessages,
  tr: trMessages,
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const locale = useLanguageStore((state) => state.locale);

  useEffect(() => {
    async function bootstrap() {
      try {
        await analyticsService.initialize();
        await revenueCatProvider.configure();

        const messages = localeMessages[locale] ?? localeMessages.en;
        i18n.load(locale, messages);
        i18n.activate(locale);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    bootstrap();
  }, [locale]);

  return (
    <I18nProvider i18n={i18n}>
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme="dark"
      >
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(modals)" />
            <Stack.Screen name="session" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="list" />
            <Stack.Screen name="achievements" />
            <Stack.Screen name="paywall" />
          </Stack>
          <AchievementUnlockModal />
          <LevelUpModal />
          <StatusBar style="light" />
        </QueryClientProvider>
      </TamaguiProvider>
    </I18nProvider>
  );
}
