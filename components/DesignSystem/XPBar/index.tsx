import { XStack, YStack } from "tamagui";

import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { BodySmall, Caption } from "@/components/DesignSystem/Typography";
import type { LevelDefinition } from "@/constants/levels";
import { getLevelDisplayName, getXPForNextLevel } from "@/constants/levels";

interface XPBarProps {
  totalXP: number;
  level: LevelDefinition;
}

export function XPBar({ totalXP, level }: XPBarProps) {
  const { currentXP, nextLevelXP, progress } = getXPForNextLevel(totalXP);
  const displayName = getLevelDisplayName(level);

  const isMaxLevel = progress >= 1 && currentXP === nextLevelXP;

  return (
    <YStack gap="$1.5" width="100%">
      <XStack justifyContent="space-between" alignItems="center">
        <BodySmall fontWeight="600" color="#09122C">
          {level.emoji} {displayName}
        </BodySmall>
        <Caption color="#777777">
          {isMaxLevel
            ? `${totalXP} XP — Max!`
            : `${currentXP} / ${nextLevelXP} XP`}
        </Caption>
      </XStack>
      <ProgressBar progress={progress} color="primary" height={6} />
    </YStack>
  );
}
