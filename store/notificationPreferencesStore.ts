import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

export type ReminderTime = "morning" | "afternoon" | "evening" | "night";

interface NotificationPreferencesState {
  pushEnabled: boolean;
  dailyReminder: boolean;
  weeklyDigest: boolean;
  selectedReminderTime: ReminderTime;
  streakProtection: boolean;
  achievementAlerts: boolean;
  setPushEnabled: (value: boolean) => void;
  setDailyReminder: (value: boolean) => void;
  setWeeklyDigest: (value: boolean) => void;
  setSelectedReminderTime: (value: ReminderTime) => void;
  setStreakProtection: (value: boolean) => void;
  setAchievementAlerts: (value: boolean) => void;
}

export const useNotificationPreferencesStore =
  create<NotificationPreferencesState>()(
    persist(
      (set) => ({
        pushEnabled: true,
        dailyReminder: false,
        weeklyDigest: false,
        selectedReminderTime: "evening" as ReminderTime,
        streakProtection: true,
        achievementAlerts: true,
        setPushEnabled: (value) => set({ pushEnabled: value }),
        setDailyReminder: (value) => set({ dailyReminder: value }),
        setWeeklyDigest: (value) => set({ weeklyDigest: value }),
        setSelectedReminderTime: (value) =>
          set({ selectedReminderTime: value }),
        setStreakProtection: (value) => set({ streakProtection: value }),
        setAchievementAlerts: (value) => set({ achievementAlerts: value }),
      }),
      {
        name: "notification-preferences-storage",
        storage: createJSONStorage(createZustandStorage),
      },
    ),
  );
