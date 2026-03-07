import { ScrollView } from "react-native";
import { YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { Body, H1 } from "@/components/DesignSystem/Typography";

export default function HomeScreen() {
  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <H1>Home</H1>
        <Body color="$colorSubtitle">Welcome to your app</Body>

        <Card elevated>
          <Body fontWeight="600" marginBottom="$2">
            Getting Started
          </Body>
          <Body color="$colorSubtitle">
            This is your home screen. Start building your app from here.
          </Body>
        </Card>

        <Card elevated>
          <Body fontWeight="600" marginBottom="$2">
            Quick Actions
          </Body>
          <Body color="$colorSubtitle">
            Add your most used features here for easy access.
          </Body>
        </Card>
      </YStack>
    </ScrollView>
  );
}
