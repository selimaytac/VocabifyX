import { YStack } from "tamagui";

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
      <BodySmall fontWeight="600">
        {level.emoji} {displayName}
      </BodySmall>
      <ProgressBar progress={progress} color="primary" />
      <Caption>
        {isMaxLevel
          ? `${totalXP} XP — Max Level!`
          : `${currentXP} / ${nextLevelXP} XP`}
      </Caption>
    </YStack>
  );
}
