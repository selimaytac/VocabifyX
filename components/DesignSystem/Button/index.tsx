import { Button as TamaguiButton, styled } from "tamagui";

export const PrimaryButton = styled(TamaguiButton, {
  name: "PrimaryButton",
  backgroundColor: "#213448",
  color: "#FFFFFF",
  borderRadius: 10,
  height: 52,
  fontWeight: "700",
  fontSize: 16,
  pressStyle: {
    opacity: 0.85,
  },
  disabledStyle: {
    backgroundColor: "#B0B0B0",
    opacity: 1,
  },
});

export const SecondaryButton = styled(TamaguiButton, {
  name: "SecondaryButton",
  backgroundColor: "#F7F8FB",
  color: "#09122C",
  borderRadius: 10,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});

export const AccentButton = styled(TamaguiButton, {
  name: "AccentButton",
  backgroundColor: "#E17564",
  color: "#FFFFFF",
  borderRadius: 10,
  height: 52,
  fontWeight: "700",
  fontSize: 16,
  pressStyle: {
    opacity: 0.85,
  },
});

export const OutlineButton = styled(TamaguiButton, {
  name: "OutlineButton",
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  color: "#BE3144",
  borderRadius: 10,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});

export const DangerButton = styled(TamaguiButton, {
  name: "DangerButton",
  backgroundColor: "#FF5A5F",
  color: "#FFFFFF",
  borderRadius: 12,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.85,
  },
});

export const CancelButton = styled(TamaguiButton, {
  name: "CancelButton",
  backgroundColor: "#F5F5F5",
  color: "#333333",
  borderRadius: 12,
  height: 52,
  fontWeight: "600",
  fontSize: 16,
  pressStyle: {
    opacity: 0.8,
  },
});
