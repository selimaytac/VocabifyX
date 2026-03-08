import { styled, XStack, YStack } from "tamagui";

const ProgressTrack = styled(XStack, {
  name: "ProgressTrack",
  backgroundColor: "$gray4",
  borderRadius: 100,
  height: 8,
  overflow: "hidden",
  width: "100%",
});

const ProgressFill = styled(YStack, {
  name: "ProgressFill",
  backgroundColor: "#F5A623",
  borderRadius: 100,
  height: "100%",
  variants: {
    color: {
      success: { backgroundColor: "$green10" },
      warning: { backgroundColor: "$yellow10" },
      primary: { backgroundColor: "#F5A623" },
    },
  } as const,
});

interface ProgressBarProps {
  progress: number;
  color?: "success" | "warning" | "primary";
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
