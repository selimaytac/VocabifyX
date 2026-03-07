import { type ReactNode, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Spinner, YStack } from "tamagui";

import { PrimaryButton } from "@/components/DesignSystem/Button";
import { Body } from "@/components/DesignSystem/Typography";

function DefaultLoadingFallback() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner size="large" />
    </YStack>
  );
}

function DefaultErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Body marginBottom="$4">Something went wrong</Body>
      <PrimaryButton onPress={resetErrorBoundary}>Try Again</PrimaryButton>
    </YStack>
  );
}

interface QueryBoundaryProps {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: (props: FallbackProps) => ReactNode;
}

export function QueryBoundary({
  children,
  loadingFallback,
  errorFallback,
}: QueryBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={errorFallback ?? DefaultErrorFallback}>
      <Suspense fallback={loadingFallback ?? <DefaultLoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
