import { YStack } from "tamagui";

import { Body, Caption } from "@/components/DesignSystem/Typography";

interface StatChipProps {
  icon: string;
  value: string | number;
  label: string;
}

export function StatChip({ icon, value, label }: StatChipProps) {
  return (
    <YStack
      alignItems="center"
      gap="$1"
      backgroundColor="#F7F8FB"
      borderRadius={16}
      paddingVertical="$3"
      paddingHorizontal="$2"
      flex={1}
      borderWidth={0.5}
      borderColor="rgba(33, 52, 72, 0.06)"
    >
      <Body fontSize={22}>{icon}</Body>
      <Body fontWeight="700" fontSize={18} color="#09122C">
        {String(value)}
      </Body>
      <Caption
        color="#777777"
        textAlign="center"
        numberOfLines={1}
        fontSize={11}
      >
        {label}
      </Caption>
    </YStack>
  );
}
