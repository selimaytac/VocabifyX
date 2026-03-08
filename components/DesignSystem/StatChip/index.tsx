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
      backgroundColor="#F8F8F8"
      borderRadius={12}
      paddingVertical="$3"
      paddingHorizontal="$2"
      flex={1}
    >
      <Body fontSize={22}>{icon}</Body>
      <Body fontWeight="700" fontSize={18} color="#131313">
        {String(value)}
      </Body>
      <Caption
        color="#D7D7D7"
        textAlign="center"
        numberOfLines={1}
        fontSize={11}
      >
        {label}
      </Caption>
    </YStack>
  );
}
