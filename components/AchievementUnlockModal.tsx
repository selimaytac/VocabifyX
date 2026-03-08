import { useLingui } from "@lingui/react";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Sheet, XStack, YStack } from "tamagui";

import { PrimaryButton } from "@/components/DesignSystem/Button";
import { Body, Caption, H3, Label } from "@/components/DesignSystem/Typography";
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

  // Haptic feedback when an achievement is first shown
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
      snapPoints={[45]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding="$6" alignItems="center" gap="$4">
        <Caption color="$colorSubtitle" textTransform="uppercase" fontSize={11}>
          {i18n._("achievement.unlocked")}
        </Caption>

        <Body fontSize={56}>{achievement.icon}</Body>

        <YStack alignItems="center" gap="$2">
          <H3 textAlign="center">{i18n._(achievement.titleKey)}</H3>
          <Body color="$colorSubtitle" textAlign="center">
            {i18n._(achievement.descriptionKey)}
          </Body>
        </YStack>

        <XStack
          backgroundColor="$yellow2"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius={100}
          borderWidth={1}
          borderColor="$yellow8"
        >
          <Label color="$yellow10">⚡ +{achievement.xpReward} XP</Label>
        </XStack>

        {pendingAchievements.length > 1 && (
          <Caption color="$colorSubtitle">
            {i18n
              ._("achievement.moreUnlocked")
              .replace("{count}", String(pendingAchievements.length - 1))}
          </Caption>
        )}

        <PrimaryButton width="100%" onPress={clearPendingAchievements}>
          {i18n._("achievement.awesome")}
        </PrimaryButton>
      </Sheet.Frame>
    </Sheet>
  );
}
