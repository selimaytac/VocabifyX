import { useLingui } from "@lingui/react";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView, Switch } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import {
  cancelAllNotifications,
  type ReminderTime,
  scheduleReminders,
} from "@/services/notifications/notifications.service";
import { useGameStore } from "@/store/gameStore";
import { useNotificationPreferencesStore } from "@/store/notificationPreferencesStore";

const REMINDER_TIMES: ReminderTime[] = [
  "morning",
  "afternoon",
  "evening",
  "night",
];

export default function NotificationsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const currentStreak = useGameStore((s) => s.currentStreak);

  const {
    dailyReminder,
    achievementAlerts,
    selectedReminderTime,
    streakProtection,
    setDailyReminder,
    setAchievementAlerts,
    setSelectedReminderTime,
    setStreakProtection,
  } = useNotificationPreferencesStore();

  const timeLabels: Record<ReminderTime, string> = {
    morning: i18n._("notifications.morning"),
    afternoon: i18n._("notifications.afternoon"),
    evening: i18n._("notifications.evening"),
    night: i18n._("notifications.night"),
  };

  const applySchedule = useCallback(
    async (
      enabled: boolean,
      time: ReminderTime,
      streak: boolean,
    ): Promise<void> => {
      if (!enabled) {
        await cancelAllNotifications();
        return;
      }
      await scheduleReminders(
        time,
        streak,
        currentStreak,
        i18n._("notifications.reminderTitle"),
        i18n._("notifications.reminderBody"),
        i18n._("notifications.streakTitle"),
        i18n._("notifications.streakBody"),
      );
    },
    [currentStreak, i18n],
  );

  const handleDailyReminderChange = useCallback(
    async (value: boolean): Promise<void> => {
      setDailyReminder(value);
      await applySchedule(value, selectedReminderTime, streakProtection);
    },
    [setDailyReminder, applySchedule, selectedReminderTime, streakProtection],
  );

  const handleTimeChange = useCallback(
    async (time: ReminderTime): Promise<void> => {
      setSelectedReminderTime(time);
      if (dailyReminder) {
        await applySchedule(true, time, streakProtection);
      }
    },
    [setSelectedReminderTime, dailyReminder, applySchedule, streakProtection],
  );

  const handleStreakProtectionChange = useCallback(
    async (value: boolean): Promise<void> => {
      setStreakProtection(value);
      if (dailyReminder) {
        await applySchedule(true, selectedReminderTime, value);
      }
    },
    [setStreakProtection, dailyReminder, applySchedule, selectedReminderTime],
  );

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <XStack alignItems="center" gap="$3">
          <XStack
            onPress={() => router.back()}
            padding="$2"
            borderRadius={8}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="$color" />
          </XStack>
          <H2>{i18n._("notifications.title")}</H2>
        </XStack>

        <Card elevated>
          <H3 marginBottom="$3">{i18n._("notifications.types")}</H3>
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1} marginRight="$3">
                <Label>{i18n._("notifications.studyReminders")}</Label>
                <Caption color="$colorSubtitle">
                  {i18n._("notifications.studyRemindersDesc")}
                </Caption>
              </YStack>
              <Switch
                value={dailyReminder}
                onValueChange={handleDailyReminderChange}
                trackColor={{ false: "#767577", true: "#3B82F6" }}
              />
            </XStack>

            <XStack height={1} backgroundColor="$gray4" marginVertical="$1" />

            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1} marginRight="$3">
                <Label>{i18n._("notifications.streakProtection")}</Label>
                <Caption color="$colorSubtitle">
                  {i18n._("notifications.streakProtectionDesc")}
                </Caption>
              </YStack>
              <Switch
                value={streakProtection}
                onValueChange={handleStreakProtectionChange}
                trackColor={{ false: "#767577", true: "#3B82F6" }}
              />
            </XStack>

            <XStack height={1} backgroundColor="$gray4" marginVertical="$1" />

            <XStack justifyContent="space-between" alignItems="center">
              <YStack flex={1} marginRight="$3">
                <Label>{i18n._("notifications.achievements")}</Label>
                <Caption color="$colorSubtitle">
                  {i18n._("notifications.achievementsDesc")}
                </Caption>
              </YStack>
              <Switch
                value={achievementAlerts}
                onValueChange={setAchievementAlerts}
                trackColor={{ false: "#767577", true: "#3B82F6" }}
              />
            </XStack>
          </YStack>
        </Card>

        {dailyReminder && (
          <Card elevated>
            <H3 marginBottom="$3">{i18n._("notifications.time")}</H3>
            <YStack gap="$2">
              {REMINDER_TIMES.map((time) => (
                <XStack
                  key={time}
                  onPress={() => handleTimeChange(time)}
                  paddingVertical="$3"
                  paddingHorizontal="$2"
                  borderRadius={10}
                  backgroundColor={
                    selectedReminderTime === time ? "#3d2d0a" : "$background"
                  }
                  borderWidth={1}
                  borderColor={
                    selectedReminderTime === time ? "#F5A623" : "$borderColor"
                  }
                  alignItems="center"
                  gap="$3"
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Caption fontSize={20}>{timeEmoji(time)}</Caption>
                  <Body
                    color={selectedReminderTime === time ? "#F5A623" : "$color"}
                  >
                    {timeLabels[time]}
                  </Body>
                  {selectedReminderTime === time && (
                    <XStack flex={1} justifyContent="flex-end">
                      <Caption color="#F5A623">✓</Caption>
                    </XStack>
                  )}
                </XStack>
              ))}
            </YStack>
          </Card>
        )}

        <Card elevated>
          <YStack gap="$2">
            <Body fontSize={20} textAlign="center">
              💡
            </Body>
            <BodySmall color="$colorSubtitle" textAlign="center">
              {i18n._("notifications.permissionNote")}
            </BodySmall>
          </YStack>
        </Card>
      </YStack>
    </ScrollView>
  );
}

function timeEmoji(time: ReminderTime): string {
  switch (time) {
    case "morning":
      return "🌅";
    case "afternoon":
      return "☀️";
    case "evening":
      return "🌆";
    case "night":
      return "🌙";
  }
}
