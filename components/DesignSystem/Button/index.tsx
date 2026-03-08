import { Button as TamaguiButton, styled } from "tamagui";

export const PrimaryButton = styled(TamaguiButton, {
  name: "PrimaryButton",
  backgroundColor: "#007AFF",
  color: "#FFFFFF",
  borderRadius: 12,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.85,
  },
  disabledStyle: {
    backgroundColor: "#D7D7D7",
    opacity: 1,
  },
});

export const SecondaryButton = styled(TamaguiButton, {
  name: "SecondaryButton",
  backgroundColor: "#F8F8F8",
  color: "#131313",
  borderRadius: 12,
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
  borderColor: "#F2F2F2",
  color: "#D53F36",
  borderRadius: 12,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});
