import { Button as TamaguiButton, styled } from "tamagui";

export const PrimaryButton = styled(TamaguiButton, {
  name: "PrimaryButton",
  backgroundColor: "$blue10",
  color: "$white1",
  borderRadius: 12,
  height: 48,
  fontWeight: "600",
  pressStyle: {
    opacity: 0.8,
  },
});

export const SecondaryButton = styled(TamaguiButton, {
  name: "SecondaryButton",
  backgroundColor: "$gray4",
  color: "$gray12",
  borderRadius: 12,
  height: 48,
  fontWeight: "600",
  pressStyle: {
    opacity: 0.8,
  },
});

export const OutlineButton = styled(TamaguiButton, {
  name: "OutlineButton",
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "$gray7",
  color: "$gray12",
  borderRadius: 12,
  height: 48,
  fontWeight: "600",
  pressStyle: {
    opacity: 0.8,
  },
});
