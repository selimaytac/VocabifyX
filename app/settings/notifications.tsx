import { useLingui } from "@lingui/react";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { useNotificationPreferencesStore } from "@/store/notificationPreferencesStore";

type ReminderTime = "morning" | "afternoon" | "evening" | "night";

const REMINDER_TIMES: ReminderTime[] = [
  "morning",
  "afternoon",
  "evening",
  "night",
];

export default function NotificationsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();

  const { pushEnabled, dailyReminder, setPushEnabled, setDailyReminder } =
    useNotificationPreferencesStore();

  const [achievementAlerts, setAchievementAlerts] = useState(true);
  const [selectedTime, setSelectedTime] = useState<ReminderTime>("evening");

  const timeLabels: Record<ReminderTime, string> = {
    morning: i18n._("notifications.morning"),
    afternoon: i18n._("notifications.afternoon"),
    evening: i18n._("notifications.evening"),
    night: i18n._("notifications.night"),
  };

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
          <H3 marginBottom="$3">Notification Types</H3>
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
                onValueChange={setDailyReminder}
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
                value={pushEnabled}
                onValueChange={setPushEnabled}
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
                  onPress={() => setSelectedTime(time)}
                  paddingVertical="$3"
                  paddingHorizontal="$2"
                  borderRadius={10}
                  backgroundColor={
                    selectedTime === time ? "$blue2" : "$background"
                  }
                  borderWidth={1}
                  borderColor={
                    selectedTime === time ? "$blue10" : "$borderColor"
                  }
                  alignItems="center"
                  gap="$3"
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Caption fontSize={20}>{timeEmoji(time)}</Caption>
                  <Body color={selectedTime === time ? "$blue10" : "$color"}>
                    {timeLabels[time]}
                  </Body>
                  {selectedTime === time && (
                    <XStack flex={1} justifyContent="flex-end">
                      <Caption color="$blue10">✓</Caption>
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
              Notification scheduling requires device permissions. Settings are
              saved locally and will apply when permissions are granted.
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
