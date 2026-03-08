import { Button as TamaguiButton, styled } from "tamagui";

export const PrimaryButton = styled(TamaguiButton, {
  name: "PrimaryButton",
  backgroundColor: "#F5A623",
  color: "#1a1a1a",
  borderRadius: 26,
  height: 52,
  fontWeight: "700",
  fontSize: 17,
  pressStyle: {
    opacity: 0.85,
  },
  disabledStyle: {
    backgroundColor: "#2a2a2a",
    opacity: 1,
  },
});

export const SecondaryButton = styled(TamaguiButton, {
  name: "SecondaryButton",
  backgroundColor: "#2a2a2a",
  color: "$gray10",
  borderRadius: 26,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});

export const OutlineButton = styled(TamaguiButton, {
  name: "OutlineButton",
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#444",
  color: "$gray11",
  borderRadius: 26,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});
