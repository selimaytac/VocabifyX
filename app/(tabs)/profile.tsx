import { useLingui } from "@lingui/react";
import { ChevronRight, Settings } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { Avatar, XStack, YStack } from "tamagui";

import { LevelBadge } from "@/components/DesignSystem/Badge";
import { OutlineButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { StatChip } from "@/components/DesignSystem/StatChip";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { XPBar } from "@/components/DesignSystem/XPBar";
import { getAchievementById } from "@/constants/achievements";
import { getLevelForXP } from "@/constants/levels";
import { useAuth } from "@/hooks/useAuth";
import { useGameStore } from "@/store/gameStore";
import { useListsStore } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

export default function ProfileScreen() {
  const { i18n } = useLingui();
  const { user, signOut } = useAuth();
  const profile = useUserStore((state) => state.profile);
  const router = useRouter();
  const { totalXP, currentStreak, longestStreak, achievements, stats } =
    useGameStore();
  const lists = useListsStore((state) => state.lists);

  const currentLevel = getLevelForXP(totalXP);

  const recentAchievements = [...achievements]
    .sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <YStack alignItems="center" paddingVertical="$6" gap="$3">
          <Avatar circular size="$8" marginBottom="$1">
            <Avatar.Fallback backgroundColor="#3d2d0a" />
          </Avatar>
          <H2>{profile?.displayName ?? "User"}</H2>
          <Body color="$colorSubtitle">{user?.email ?? ""}</Body>
          <LevelBadge level={currentLevel} size="md" />
        </YStack>

        <Card elevated>
          <XPBar totalXP={totalXP} level={currentLevel} />
        </Card>

        <XStack gap="$2">
          <StatChip
            icon="⚡"
            value={totalXP}
            label={i18n._("profile.totalXP")}
          />
          <StatChip
            icon="🔥"
            value={`${currentStreak}d`}
            label={i18n._("profile.streak")}
          />
          <StatChip
            icon="📚"
            value={lists.length}
            label={i18n._("profile.listsCreated")}
          />
        </XStack>

        <XStack gap="$2">
          <StatChip
            icon="📝"
            value={stats.sessionsCompleted}
            label={i18n._("profile.sessionsCompleted")}
          />
          <StatChip
            icon="🎯"
            value={stats.wordsMastered}
            label={i18n._("profile.wordsLearned")}
          />
          <StatChip
            icon="🏆"
            value={`${longestStreak}d`}
            label={i18n._("profile.streak")}
          />
        </XStack>

        <Card elevated>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$2"
          >
            <H3>{i18n._("profile.recentAchievements")}</H3>
            <XStack
              onPress={() => router.push("/achievements")}
              pressStyle={{ opacity: 0.7 }}
            >
              <Caption color="#F5A623">{i18n._("profile.viewAll")}</Caption>
            </XStack>
          </XStack>
          {recentAchievements.length === 0 ? (
            <BodySmall color="$colorSubtitle">
              {i18n._("profile.noAchievements")}
            </BodySmall>
          ) : (
            <YStack gap="$2">
              {recentAchievements.map((ua) => {
                const achievement = getAchievementById(ua.achievementId);
                if (!achievement) return null;
                return (
                  <XStack
                    key={ua.achievementId}
                    alignItems="center"
                    gap="$3"
                    paddingVertical="$1"
                  >
                    <Body fontSize={24}>{achievement.icon}</Body>
                    <YStack flex={1}>
                      <Label>{i18n._(achievement.titleKey)}</Label>
                      <Caption>+{ua.xpAwarded} XP</Caption>
                    </YStack>
                  </XStack>
                );
              })}
            </YStack>
          )}
        </Card>

        <Card
          pressStyle={{ opacity: 0.8 }}
          onPress={() => router.push("/settings")}
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" gap="$3">
              <Settings size={20} color="$gray11" />
              <Label>{i18n._("common.settings")}</Label>
            </XStack>
            <ChevronRight size={20} color="$gray9" />
          </XStack>
        </Card>

        <OutlineButton onPress={signOut} marginTop="$4">
          {i18n._("common.logout")}
        </OutlineButton>
      </YStack>
    </ScrollView>
  );
}
