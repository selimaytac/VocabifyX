import { Redirect } from "expo-router";

import { useUserStore } from "@/store/userStore";

export default function Index() {
  const hasCompletedOnboarding = useUserStore(
    (state) => state.hasCompletedOnboarding,
  );

  // Auth is optional ("Sign in to sync" in Settings).
  // Onboarding is always the first step — no mandatory login.
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
