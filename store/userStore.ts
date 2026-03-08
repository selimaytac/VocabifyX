import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  learningPurpose?: "work" | "travel" | "education" | "personal";
  proficiencyLevel?: "beginner" | "elementary" | "intermediate" | "advanced";
  dailyWordGoal?: number;
  interestedTopics?: string[];
}

interface UserState {
  profile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  /** Persists the current onboarding step so the flow is resumable on reopen. */
  onboardingStep: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  setOnboardingStep: (step: string | null) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  hasCompletedOnboarding: false,
  onboardingStep: null,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ profile }),
      setHasCompletedOnboarding: (value) =>
        set({ hasCompletedOnboarding: value }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      reset: () => set(initialState),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
