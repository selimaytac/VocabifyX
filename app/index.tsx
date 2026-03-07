import { Redirect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

export default function Index() {
  const { session, loading } = useAuth();
  const hasCompletedOnboarding = useUserStore(
    (state) => state.hasCompletedOnboarding,
  );

  if (loading) return null;

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
