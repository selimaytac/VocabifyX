import { YStack } from "tamagui";

import { PrimaryButton } from "@/components/DesignSystem/Button";
import { Body, BodySmall, H3 } from "@/components/DesignSystem/Typography";

interface ErrorStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export function ErrorState({
  emoji = "😕",
  title,
  subtitle,
  retryLabel,
  onRetry,
}: ErrorStateProps) {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      padding="$5"
    >
      <Body fontSize={64}>{emoji}</Body>
      <H3 textAlign="center">{title}</H3>
      {subtitle ? (
        <BodySmall color="$colorSubtitle" textAlign="center">
          {subtitle}
        </BodySmall>
      ) : null}
      {onRetry && retryLabel ? (
        <PrimaryButton onPress={onRetry}>{retryLabel}</PrimaryButton>
      ) : null}
    </YStack>
  );
}
