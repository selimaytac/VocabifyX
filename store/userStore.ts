import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

interface UserState {
  profile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  hasCompletedOnboarding: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ profile }),
      setHasCompletedOnboarding: (value) =>
        set({ hasCompletedOnboarding: value }),
      reset: () => set(initialState),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
