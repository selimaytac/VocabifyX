import { YStack } from "tamagui";

import { Caption, H3 } from "@/components/DesignSystem/Typography";

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
      backgroundColor="$gray3"
      borderRadius={12}
      padding="$3"
      flex={1}
      minWidth={80}
    >
      <Caption>{icon}</Caption>
      <H3>{value}</H3>
      <Caption>{label}</Caption>
    </YStack>
  );
}
