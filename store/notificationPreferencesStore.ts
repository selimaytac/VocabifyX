import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

interface NotificationPreferencesState {
  pushEnabled: boolean;
  dailyReminder: boolean;
  weeklyDigest: boolean;
  setPushEnabled: (value: boolean) => void;
  setDailyReminder: (value: boolean) => void;
  setWeeklyDigest: (value: boolean) => void;
}

export const useNotificationPreferencesStore =
  create<NotificationPreferencesState>()(
    persist(
      (set) => ({
        pushEnabled: true,
        dailyReminder: false,
        weeklyDigest: false,
        setPushEnabled: (value) => set({ pushEnabled: value }),
        setDailyReminder: (value) => set({ dailyReminder: value }),
        setWeeklyDigest: (value) => set({ weeklyDigest: value }),
      }),
      {
        name: "notification-preferences-storage",
        storage: createJSONStorage(createZustandStorage),
      },
    ),
  );
