import { useLingui } from "@lingui/react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  Trash2,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  Body,
  BodySmall,
  Caption,
  Label,
} from "@/components/DesignSystem/Typography";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  showChevron?: boolean;
}

function SettingsRow({
  icon,
  label,
  onPress,
  trailing,
  showChevron = true,
}: SettingsRowProps) {
  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$4"
      alignItems="center"
      justifyContent="space-between"
      onPress={onPress}
      pressStyle={onPress ? { opacity: 0.7 } : undefined}
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        {icon}
        <Label color="$color">{label}</Label>
      </XStack>
      {trailing ??
        (showChevron && onPress ? (
          <ChevronRight size={18} color="#9CA3AF" />
        ) : null)}
    </XStack>
  );
}

function Divider() {
  return (
    <YStack height={1} backgroundColor="$borderColor" marginHorizontal="$4" />
  );
}

export default function SettingsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { signOut } = useAuth();
  const profile = useUserStore((state) => state.profile);

  const initial =
    profile?.displayName?.[0]?.toUpperCase() ??
    profile?.email?.[0]?.toUpperCase() ??
    "U";

  const handleDeleteAccount = () => {
    Alert.alert(
      i18n._("settings.deleteAccount"),
      "This action cannot be undone. Are you sure?",
      [
        { text: i18n._("common.cancel"), style: "cancel" },
        {
          text: i18n._("settings.deleteAccount"),
          style: "destructive",
          onPress: () => signOut(),
        },
      ],
    );
  };

  return (
    <ScrollView style={{ backgroundColor: "transparent" }}>
      <YStack padding="$4" gap="$5" paddingBottom="$8">
        {/* Account section */}
        <YStack gap="$2">
          <Caption
            color="$colorSubtitle"
            fontWeight="700"
            fontSize={12}
            paddingLeft="$1"
          >
            {i18n._("settings.account")}
          </Caption>
          <YStack
            backgroundColor="$background"
            borderRadius={16}
            borderWidth={1}
            borderColor="$borderColor"
            overflow="hidden"
          >
            {/* Profile row */}
            <XStack padding="$4" alignItems="center" gap="$3">
              <XStack
                width={52}
                height={52}
                borderRadius={26}
                backgroundColor="#30A46C"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Body color="#FFFFFF" fontWeight="700" fontSize={22}>
                  {initial}
                </Body>
              </XStack>
              <YStack flex={1} gap="$1">
                <Label fontWeight="700">{profile?.displayName ?? "—"}</Label>
                <Caption color="$colorSubtitle">
                  {profile?.email ?? "—"}
                </Caption>
              </YStack>
              <XStack
                backgroundColor="$gray3"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius={100}
              >
                <Caption color="$colorSubtitle" fontWeight="600">
                  {i18n._("settings.free")}
                </Caption>
              </XStack>
            </XStack>

            {profile?.id && (
              <>
                <Divider />
                <XStack padding="$4" gap="$3" alignItems="center">
                  <BodySmall color="$colorSubtitle" fontWeight="600">
                    {i18n._("settings.userId")}:{" "}
                  </BodySmall>
                  <Caption color="$colorSubtitle" flex={1} numberOfLines={1}>
                    {profile.id}
                  </Caption>
                </XStack>
              </>
            )}

            <Divider />
            <SettingsRow
              icon={<CreditCard size={20} color="$colorSubtitle" />}
              label={i18n._("settings.manageSubscription")}
              onPress={() => router.push("/settings/manage-subscription")}
            />
          </YStack>
        </YStack>

        {/* General section */}
        <YStack gap="$2">
          <Caption
            color="$colorSubtitle"
            fontWeight="700"
            fontSize={12}
            paddingLeft="$1"
          >
            {i18n._("settings.general")}
          </Caption>
          <YStack
            backgroundColor="$background"
            borderRadius={16}
            borderWidth={1}
            borderColor="$borderColor"
            overflow="hidden"
          >
            <SettingsRow
              icon={<Globe size={20} color="$colorSubtitle" />}
              label={i18n._("settings.language")}
              onPress={() => router.push("/settings/language")}
            />
            <Divider />
            <SettingsRow
              icon={<Bell size={20} color="$colorSubtitle" />}
              label={i18n._("settings.notifications")}
              onPress={() => router.push("/settings/notifications")}
            />
          </YStack>
        </YStack>

        {/* Delete account */}
        <XStack
          backgroundColor="#FEF2F2"
          borderRadius={16}
          borderWidth={1}
          borderColor="#FECACA"
          padding="$4"
          alignItems="center"
          justifyContent="center"
          gap="$2"
          pressStyle={{ opacity: 0.7 }}
          onPress={handleDeleteAccount}
        >
          <Trash2 size={18} color="#E5484D" />
          <Body color="#E5484D" fontWeight="600">
            {i18n._("settings.deleteAccount")}
          </Body>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
