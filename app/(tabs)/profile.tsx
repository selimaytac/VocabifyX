import { ChevronRight, Settings } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Avatar, XStack, YStack } from "tamagui";

import { OutlineButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { Body, H2, Label } from "@/components/DesignSystem/Typography";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const profile = useUserStore((state) => state.profile);
  const router = useRouter();

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <YStack alignItems="center" paddingVertical="$6">
          <Avatar circular size="$8" marginBottom="$3">
            <Avatar.Fallback backgroundColor="$blue5" />
          </Avatar>
          <H2>{profile?.displayName ?? "User"}</H2>
          <Body color="$colorSubtitle">{user?.email ?? ""}</Body>
        </YStack>

        <Card
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push("/settings")}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$3">
              <Settings size={20} color="$gray11" />
              <Label>Settings</Label>
            </XStack>
            <ChevronRight size={20} color="$gray9" />
          </XStack>
        </Card>

        <OutlineButton onPress={signOut} marginTop="$4">
          Log Out
        </OutlineButton>
      </YStack>
    </ScrollView>
  );
}
