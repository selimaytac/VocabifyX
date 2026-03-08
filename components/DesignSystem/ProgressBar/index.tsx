import { styled, XStack, YStack } from "tamagui";

const ProgressTrack = styled(XStack, {
  name: "ProgressTrack",
  backgroundColor: "#F8F8F8",
  borderRadius: 100,
  height: 8,
  overflow: "hidden",
  width: "100%",
});

const ProgressFill = styled(YStack, {
  name: "ProgressFill",
  backgroundColor: "#007AFF",
  borderRadius: 100,
  height: "100%",
  variants: {
    color: {
      success: { backgroundColor: "#38AD49" },
      warning: { backgroundColor: "#F5A623" },
      primary: { backgroundColor: "#007AFF" },
      error: { backgroundColor: "#D53F36" },
    },
  } as const,
});

interface ProgressBarProps {
  progress: number;
  color?: "success" | "warning" | "primary" | "error";
  height?: number;
}

export function ProgressBar({
  progress,
  color = "primary",
  height = 8,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <ProgressTrack height={height}>
      <ProgressFill
        color={color}
        width={`${clampedProgress * 100}%` as `${number}%`}
      />
    </ProgressTrack>
  );
}
