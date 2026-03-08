import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  learningPurpose?: "work" | "travel" | "education" | "personal";
  dailyWordGoal?: number;
}

interface UserState {
  profile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  /** Persists the current onboarding step so the flow is resumable on reopen. */
  onboardingStep: string | null;
  /** Topic entered by the user during onboarding — used for paywall personalisation. */
  onboardingTopic: string | null;
  /** Category selected during onboarding — used for paywall personalisation. */
  onboardingCategory: string | null;
  /** Word count chosen during onboarding — used for paywall personalisation. */
  onboardingWordCount: number;
  setProfile: (profile: UserProfile | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setOnboardingStep: (step: string | null) => void;
  setOnboardingPersonalization: (data: {
    topic: string;
    category: string;
    wordCount: number;
  }) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  hasCompletedOnboarding: false,
  onboardingStep: null,
  onboardingTopic: null,
  onboardingCategory: null,
  onboardingWordCount: 15,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ profile }),
      setHasCompletedOnboarding: (value) =>
        set({ hasCompletedOnboarding: value }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      setOnboardingPersonalization: ({ topic, category, wordCount }) =>
        set({
          onboardingTopic: topic,
          onboardingCategory: category,
          onboardingWordCount: wordCount,
        }),
      reset: () => set(initialState),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
