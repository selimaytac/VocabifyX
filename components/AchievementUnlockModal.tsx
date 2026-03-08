import { useLingui } from "@lingui/react";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Sheet, XStack, YStack } from "tamagui";

import {
  Body,
  BodySmall,
  Caption,
  H2,
  Label,
} from "@/components/DesignSystem/Typography";
import { getAchievementById } from "@/constants/achievements";
import { useGameStore } from "@/store/gameStore";

export function AchievementUnlockModal() {
  const { i18n } = useLingui();
  const pendingAchievements = useGameStore((s) => s.pendingAchievements);
  const clearPendingAchievements = useGameStore(
    (s) => s.clearPendingAchievements,
  );

  const isOpen = pendingAchievements.length > 0;
  const first = pendingAchievements[0];
  const achievement = first ? getAchievementById(first.id) : undefined;

  useEffect(() => {
    if (isOpen) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    }
  }, [isOpen]);

  if (!achievement) return null;

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) clearPendingAchievements();
      }}
      snapPoints={[75]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame
        backgroundColor="#EEF2F7"
        padding="$5"
        alignItems="center"
        gap="$4"
      >
        {/* Badge circle with decorative ring */}
        <YStack alignItems="center" justifyContent="center" marginTop="$2">
          <XStack
            width={96}
            height={96}
            borderRadius={48}
            backgroundColor={achievement.badgeColor}
            alignItems="center"
            justifyContent="center"
            shadowColor="#000"
            shadowOpacity={0.15}
            shadowRadius={12}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Body fontSize={44}>{achievement.icon}</Body>
          </XStack>
          {/* Decorative dots */}
          <XStack
            position="absolute"
            width={128}
            height={128}
            borderRadius={64}
            borderWidth={2}
            borderColor={achievement.badgeColor}
            opacity={0.25}
          />
        </YStack>

        {/* Title */}
        <H2 color="#0D0D0D" textAlign="center" fontWeight="700">
          {i18n._(achievement.titleKey)}
        </H2>

        {/* Description card */}
        <YStack
          backgroundColor="#FFFFFF"
          borderRadius={12}
          padding="$4"
          width="100%"
          alignItems="center"
          gap="$2"
        >
          <Label color="#0D0D0D" textAlign="center" fontWeight="600">
            {i18n._(achievement.descriptionKey)}
          </Label>
        </YStack>

        {/* How to earn hint */}
        <Caption color="#6B7280" textAlign="center">
          💡 How to earn: {i18n._(achievement.descriptionKey)}
        </Caption>

        {/* Progress card */}
        <YStack
          backgroundColor="#FFFFFF"
          borderRadius={12}
          padding="$4"
          width="100%"
          gap="$3"
          alignItems="center"
        >
          <Label color="#0D0D0D" fontWeight="600">
            Progress
          </Label>
          <YStack
            backgroundColor="#1B2D4F"
            borderRadius={100}
            height={8}
            width="100%"
          />
          <XStack gap="$2" alignItems="center">
            <Body fontWeight="700" color="#0D0D0D" fontSize={18}>
              ✓ Completed
            </Body>
          </XStack>
          <Caption color="#9CA3AF">100%</Caption>
        </YStack>

        {/* XP badge */}
        <XStack
          backgroundColor="#FEF3E2"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius={100}
          borderWidth={1}
          borderColor="#F5A623"
        >
          <BodySmall color="#F5A623" fontWeight="700">
            ⚡ +{achievement.xpReward} XP
          </BodySmall>
        </XStack>

        {pendingAchievements.length > 1 && (
          <Caption color="#9CA3AF">
            {i18n
              ._("achievement.moreUnlocked")
              .replace("{count}", String(pendingAchievements.length - 1))}
          </Caption>
        )}

        {/* CTA button */}
        <XStack
          backgroundColor="#1B2D4F"
          borderRadius={100}
          height={52}
          width="100%"
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.85 }}
          onPress={clearPendingAchievements}
        >
          <Body color="#FFFFFF" fontWeight="700" fontSize={16}>
            🏆 {i18n._("achievement.unlocked")}
          </Body>
        </XStack>
      </Sheet.Frame>
    </Sheet>
  );
}
