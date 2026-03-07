import { useLingui } from "@lingui/react";
import { Bell, ChevronRight, CreditCard, Globe } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { Label } from "@/components/DesignSystem/Typography";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

function SettingsItem({ icon, label, onPress }: SettingsItemProps) {
  return (
    <Card pressStyle={{ opacity: 0.8 }} onPress={onPress}>
      <XStack justifyContent="space-between" alignItems="center">
        <XStack alignItems="center" gap="$3">
          {icon}
          <Label>{label}</Label>
        </XStack>
        <ChevronRight size={20} color="$gray9" />
      </XStack>
    </Card>
  );
}

export default function SettingsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();

  return (
    <ScrollView>
      <YStack padding="$4" gap="$3">
        <SettingsItem
          icon={<CreditCard size={20} color="$gray11" />}
          label={i18n._("settings.manageSubscription")}
          onPress={() => router.push("/settings/manage-subscription")}
        />
        <SettingsItem
          icon={<Globe size={20} color="$gray11" />}
          label={i18n._("settings.language")}
          onPress={() => router.push("/settings/language")}
        />
        <SettingsItem
          icon={<Bell size={20} color="$gray11" />}
          label={i18n._("settings.notifications")}
          onPress={() => router.push("/settings/notifications")}
        />
      </YStack>
    </ScrollView>
  );
}
