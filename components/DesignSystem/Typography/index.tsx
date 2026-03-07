import { styled, Text } from "tamagui";

export const H1 = styled(Text, {
  name: "H1",
  fontSize: 32,
  fontWeight: "700",
  lineHeight: 40,
});

export const H2 = styled(Text, {
  name: "H2",
  fontSize: 24,
  fontWeight: "600",
  lineHeight: 32,
});

export const H3 = styled(Text, {
  name: "H3",
  fontSize: 20,
  fontWeight: "600",
  lineHeight: 28,
});

export const Body = styled(Text, {
  name: "Body",
  fontSize: 16,
  fontWeight: "400",
  lineHeight: 24,
});

export const BodySmall = styled(Text, {
  name: "BodySmall",
  fontSize: 14,
  fontWeight: "400",
  lineHeight: 20,
});

export const Caption = styled(Text, {
  name: "Caption",
  fontSize: 12,
  fontWeight: "400",
  lineHeight: 16,
  color: "$colorSubtitle",
});

export const Label = styled(Text, {
  name: "Label",
  fontSize: 14,
  fontWeight: "500",
  lineHeight: 20,
});
