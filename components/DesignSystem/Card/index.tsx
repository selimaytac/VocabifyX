import { styled, YStack } from "tamagui";

export const Card = styled(YStack, {
  name: "Card",
  backgroundColor: "#F8F8F8",
  borderRadius: 12,
  padding: "$4",
  variants: {
    elevated: {
      true: {},
    },
    primary: {
      true: {
        backgroundColor: "#E5F2FF",
      },
    },
  } as const,
});
