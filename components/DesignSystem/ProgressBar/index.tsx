import { styled, XStack, YStack } from "tamagui";

const ProgressTrack = styled(XStack, {
  name: "ProgressTrack",
  backgroundColor: "#E0E0E0",
  borderRadius: 100,
  height: 8,
  overflow: "hidden",
  width: "100%",
});

const ProgressFill = styled(YStack, {
  name: "ProgressFill",
  backgroundColor: "#213448",
  borderRadius: 100,
  height: "100%",
  variants: {
    color: {
      success: { backgroundColor: "#4CAF50" },
      warning: { backgroundColor: "#FFC107" },
      primary: { backgroundColor: "#213448" },
      error: { backgroundColor: "#F44336" },
      accent: { backgroundColor: "#E17564" },
    },
  } as const,
});

interface ProgressBarProps {
  progress: number;
  color?: "success" | "warning" | "primary" | "error" | "accent";
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
