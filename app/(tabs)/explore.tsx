import { ScrollView } from "react-native";
import { YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { Body, H1 } from "@/components/DesignSystem/Typography";

export default function ExploreScreen() {
  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <H1>Explore</H1>
        <Body color="$colorSubtitle">Discover new content</Body>

        <Card elevated>
          <Body fontWeight="600" marginBottom="$2">
            Featured
          </Body>
          <Body color="$colorSubtitle">Add your featured content here.</Body>
        </Card>

        <Card elevated>
          <Body fontWeight="600" marginBottom="$2">
            Categories
          </Body>
          <Body color="$colorSubtitle">
            Organize your content by categories.
          </Body>
        </Card>
      </YStack>
    </ScrollView>
  );
}
