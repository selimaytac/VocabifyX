import { useLingui } from "@lingui/react";
import { Sheet, XStack, YStack } from "tamagui";

import { LevelBadge } from "@/components/DesignSystem/Badge";
import { PrimaryButton } from "@/components/DesignSystem/Button";
import { Body, Caption, H2, H3 } from "@/components/DesignSystem/Typography";
import { useGameStore } from "@/store/gameStore";

export function LevelUpModal() {
  const { i18n } = useLingui();
  const pendingLevelUp = useGameStore((s) => s.pendingLevelUp);
  const clearPendingLevelUp = useGameStore((s) => s.clearPendingLevelUp);

  const isOpen = pendingLevelUp !== null;

  if (!pendingLevelUp) return null;

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) clearPendingLevelUp();
      }}
      snapPoints={[50]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding="$6" alignItems="center" gap="$4">
        <Caption color="$colorSubtitle" textTransform="uppercase" fontSize={11}>
          {i18n._("levelUp.title")}
        </Caption>

        <H2 fontSize={64}>{pendingLevelUp.emoji}</H2>

        <YStack alignItems="center" gap="$2">
          <H3 textAlign="center">{i18n._("levelUp.congratulations")}</H3>
          <Body color="$colorSubtitle" textAlign="center">
            {i18n._("levelUp.subtitle")}
          </Body>
        </YStack>

        <XStack alignItems="center" justifyContent="center">
          <LevelBadge level={pendingLevelUp} size="lg" />
        </XStack>

        <PrimaryButton width="100%" onPress={clearPendingLevelUp}>
          {i18n._("levelUp.keepLearning")}
        </PrimaryButton>
      </Sheet.Frame>
    </Sheet>
  );
}
