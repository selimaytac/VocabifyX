import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type ReminderTime = "morning" | "afternoon" | "evening" | "night";

const TIME_CONFIGS: Record<ReminderTime, { hour: number; minute: number }> = {
  morning: { hour: 8, minute: 0 },
  afternoon: { hour: 12, minute: 30 },
  evening: { hour: 19, minute: 0 },
  night: { hour: 21, minute: 30 },
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleReminders(
  reminderTime: ReminderTime,
  streakProtection: boolean,
  currentStreak: number,
  titleStudy: string,
  bodyStudy: string,
  titleStreak: string,
  bodyStreak: string,
): Promise<void> {
  await cancelAllNotifications();

  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const { hour, minute } = TIME_CONFIGS[reminderTime];

  await Notifications.scheduleNotificationAsync({
    identifier: "daily-reminder",
    content: {
      title: titleStudy,
      body: bodyStudy,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  if (streakProtection && currentStreak >= 3) {
    // Schedule streak protection at least 1 hour before daily reminder,
    // clamped so it fires on the same calendar day (not past midnight).
    const streakHour = hour >= 2 ? hour - 1 : 22;
    await Notifications.scheduleNotificationAsync({
      identifier: "streak-protection",
      content: {
        title: titleStreak,
        body: bodyStreak,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: streakHour,
        minute,
      },
    });
  }
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleReEngagementNotification(
  title: string,
  body: string,
): Promise<void> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const fireDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await Notifications.scheduleNotificationAsync({
    identifier: "onboarding-reengagement",
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireDate,
    },
  });
}

export async function cancelReEngagementNotification(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    "onboarding-reengagement",
  );
}
