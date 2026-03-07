import { styled, YStack } from "tamagui";

export const Card = styled(YStack, {
  name: "Card",
  backgroundColor: "$background",
  borderRadius: 16,
  padding: "$4",
  borderWidth: 1,
  borderColor: "$borderColor",
  variants: {
    elevated: {
      true: {
        elevation: 2,
        shadowColor: "$shadowColor",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    },
  } as const,
});
