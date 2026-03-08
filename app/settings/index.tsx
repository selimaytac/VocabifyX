import { useLingui } from "@lingui/react";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Edit3,
  Globe,
  Info,
  Share2,
  Star,
  Trash2,
  User,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { Alert, Linking, Share, ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  Body,
  BodySmall,
  Caption,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { useAuth } from "@/hooks/useAuth";
import { useUserStore } from "@/store/userStore";

// ─── Shared primitives ──────────────────────────────────────────────────────

const CARD_STYLE = {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  borderWidth: 1,
  borderColor: "#F0F0F0",
  overflow: "hidden",
} as const;

function SectionHeader({
  children,
  uppercase = false,
}: {
  children: string;
  uppercase?: boolean;
}) {
  return (
    <Caption
      color="#999999"
      fontWeight="600"
      fontSize={13}
      letterSpacing={uppercase ? 0.4 : 0}
      paddingLeft="$1"
      paddingBottom="$1"
    >
      {uppercase ? children.toUpperCase() : children}
    </Caption>
  );
}

function Divider() {
  return <YStack height={1} backgroundColor="#F0F0F0" marginHorizontal="$4" />;
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

function Row({ icon, label, onPress, trailing }: RowProps) {
  return (
    <XStack
      paddingHorizontal="$4"
      paddingVertical="$4"
      alignItems="center"
      gap="$3"
      onPress={onPress}
      pressStyle={onPress ? { opacity: 0.65 } : undefined}
    >
      <XStack
        width={36}
        height={36}
        borderRadius={10}
        backgroundColor="#F7F8FB"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        {icon}
      </XStack>
      <Label color="#09122C" flex={1}>
        {label}
      </Label>
      {trailing ?? (onPress ? <ChevronRight size={18} color="#BBBBBB" /> : null)}
    </XStack>
  );
}

// ─── Screen ─────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { signOut } = useAuth();
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  const initial =
    profile?.displayName?.[0]?.toUpperCase() ??
    profile?.email?.[0]?.toUpperCase() ??
    "U";

  const handleEditDisplayName = () => {
    Alert.prompt(
      i18n._("settings.displayName"),
      undefined,
      (text) => {
        if (text?.trim() && profile) {
          setProfile({ ...profile, displayName: text.trim() });
        }
      },
      "plain-text",
      profile?.displayName ?? "",
    );
  };

  const handleShare = () => {
    Share.share({
      message: "Check out VocabifyX – the smartest way to learn vocabulary!",
    });
  };

  const handleRate = () => {
    Linking.openURL("https://apps.apple.com/").catch(() => undefined);
  };

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
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      <YStack padding="$4" gap="$5" paddingBottom="$10">

        {/* ── 1. ACCOUNT ─────────────────────────────────── */}
        <YStack gap="$2">
          <SectionHeader>{i18n._("settings.account")}</SectionHeader>
          <YStack {...CARD_STYLE}>

            {/* Profile row */}
            <XStack padding="$4" alignItems="center" gap="$3">
              <XStack
                width={56}
                height={56}
                borderRadius={28}
                backgroundColor="#213448"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <H3 color="#FFFFFF" fontWeight="700">
                  {initial}
                </H3>
              </XStack>
              <YStack flex={1} gap="$0.5">
                <Label fontWeight="700" fontSize={16} color="#09122C">
                  {profile?.displayName ?? "—"}
                </Label>
                <Caption color="#888888">{profile?.email ?? "—"}</Caption>
              </YStack>
              <XStack
                backgroundColor="#F0F0F0"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius={100}
              >
                <Caption color="#888888" fontWeight="600">
                  {i18n._("settings.free")}
                </Caption>
              </XStack>
            </XStack>

            {/* User ID */}
            {profile?.id ? (
              <>
                <Divider />
                <XStack
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  gap="$3"
                  alignItems="center"
                >
                  <XStack
                    width={36}
                    height={36}
                    borderRadius={10}
                    backgroundColor="#F7F8FB"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Info size={18} color="#888888" />
                  </XStack>
                  <YStack flex={1}>
                    <BodySmall color="#888888" fontWeight="600">
                      {i18n._("settings.userId")}
                    </BodySmall>
                    <Caption color="#BBBBBB" numberOfLines={1}>
                      {profile.id}
                    </Caption>
                  </YStack>
                </XStack>
              </>
            ) : null}

            {/* Manage Subscription */}
            <Divider />
            <Row
              icon={<CreditCard size={18} color="#888888" />}
              label={i18n._("settings.manageSubscription")}
              onPress={() => router.push("/settings/manage-subscription")}
            />
          </YStack>
        </YStack>

        {/* ── 2. DISPLAY NAME ────────────────────────────── */}
        <YStack {...CARD_STYLE}>
          <XStack
            paddingHorizontal="$4"
            paddingVertical="$4"
            alignItems="center"
            gap="$3"
            onPress={handleEditDisplayName}
            pressStyle={{ opacity: 0.65 }}
          >
            <XStack
              width={36}
              height={36}
              borderRadius={10}
              backgroundColor="#F7F8FB"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <User size={18} color="#888888" />
            </XStack>
            <YStack flex={1} gap="$0.5">
              <Caption color="#999999" fontWeight="600" fontSize={12}>
                {i18n._("settings.displayName")}
              </Caption>
              <Label color="#09122C" fontWeight="600">
                {profile?.displayName ?? "—"}
              </Label>
            </YStack>
            <Edit3 size={18} color="#BBBBBB" />
          </XStack>
        </YStack>

        {/* ── 3. GENERAL ─────────────────────────────────── */}
        <YStack gap="$2">
          <SectionHeader uppercase>{i18n._("settings.general")}</SectionHeader>
          <YStack {...CARD_STYLE}>
            <Row
              icon={<Globe size={18} color="#888888" />}
              label={i18n._("settings.language")}
              onPress={() => router.push("/settings/language")}
            />
          </YStack>
        </YStack>

        {/* ── 4. NOTIFICATION SETTINGS ───────────────────── */}
        <YStack {...CARD_STYLE}>
          <Row
            icon={<Bell size={18} color="#888888" />}
            label={i18n._("settings.notifications")}
            onPress={() => router.push("/settings/notifications")}
          />
        </YStack>

        {/* ── 5. ABOUT US ────────────────────────────────── */}
        <YStack gap="$2">
          <SectionHeader>{i18n._("settings.aboutUs")}</SectionHeader>
          <YStack {...CARD_STYLE}>
            <Row
              icon={<Star size={18} color="#888888" />}
              label={i18n._("settings.rate")}
              onPress={handleRate}
            />
            <Divider />
            <Row
              icon={<Share2 size={18} color="#888888" />}
              label={i18n._("settings.share")}
              onPress={handleShare}
            />
          </YStack>
        </YStack>

        {/* ── 6. DELETE ACCOUNT ──────────────────────────── */}
        <XStack
          backgroundColor="#FFEEED"
          borderRadius={16}
          borderWidth={1}
          borderColor="#FFD0CC"
          padding="$4"
          alignItems="center"
          justifyContent="center"
          gap="$2"
          pressStyle={{ opacity: 0.7 }}
          onPress={handleDeleteAccount}
        >
          <Trash2 size={20} color="#BE3144" />
          <Body color="#BE3144" fontWeight="600">
            {i18n._("settings.deleteAccount")}
          </Body>
        </XStack>

      </YStack>
    </ScrollView>
  );
}

