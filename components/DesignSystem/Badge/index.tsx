import { XStack } from "tamagui";

import { Caption, Label } from "@/components/DesignSystem/Typography";
import type { LevelDefinition } from "@/constants/levels";
import { getLevelDisplayName } from "@/constants/levels";

interface LevelBadgeProps {
  level: LevelDefinition;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: { px: "$2", py: "$1", fontSize: 12 },
  md: { px: "$3", py: "$1.5", fontSize: 14 },
  lg: { px: "$4", py: "$2", fontSize: 16 },
};

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const config = sizeConfig[size];

  return (
    <XStack
      alignItems="center"
      gap="$1"
      backgroundColor={level.badgeColor}
      paddingHorizontal={config.px}
      paddingVertical={config.py}
      borderRadius={100}
    >
      {size === "sm" ? (
        <Caption color="white" fontWeight="600">
          {level.emoji} {getLevelDisplayName(level)}
        </Caption>
      ) : (
        <Label color="white" fontWeight="600">
          {level.emoji} {getLevelDisplayName(level)}
        </Label>
      )}
    </XStack>
  );
}
