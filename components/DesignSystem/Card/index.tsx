import { styled, YStack } from "tamagui";

export const Card = styled(YStack, {
  name: "Card",
  backgroundColor: "#F7F8FB",
  borderRadius: 16,
  padding: "$4",
  borderWidth: 0.5,
  borderColor: "rgba(33, 52, 72, 0.06)",
  variants: {
    elevated: {
      true: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      },
    },
    primary: {
      true: {
        backgroundColor: "#E5F2FF",
      },
    },
    dark: {
      true: {
        backgroundColor: "#213448",
      },
    },
  } as const,
});
