import { useLingui } from "@lingui/react";
import { Settings } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { LevelBadge } from "@/components/DesignSystem/Badge";
import { OutlineButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { StatChip } from "@/components/DesignSystem/StatChip";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
} from "@/components/DesignSystem/Typography";
import { getAchievementById } from "@/constants/achievements";
import {
  getLevelDisplayName,
  getLevelForXP,
  getXPForNextLevel,
} from "@/constants/levels";
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
  const { currentXP, nextLevelXP, progress } = getXPForNextLevel(totalXP);

  const displayName = profile?.displayName ?? "User";
  const initial = displayName.charAt(0).toUpperCase();

  const recentAchievements = [...achievements]
    .sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      <YStack padding="$4" gap="$4" paddingBottom="$8" paddingTop="$12">
        {/* Settings gear */}
        <XStack justifyContent="flex-end" alignItems="center">
          <XStack
            onPress={() => router.push("/settings")}
            width={40}
            height={40}
            backgroundColor="#F5F7FA"
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.7 }}
          >
            <Settings size={20} color="#6B7280" />
          </XStack>
        </XStack>

        {/* Avatar + Name + Badge */}
        <XStack alignItems="center" gap="$3">
          <XStack
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="#6B4EFF"
            alignItems="center"
            justifyContent="center"
          >
            <H2 color="white" fontSize={26} fontWeight="700">
              {initial}
            </H2>
          </XStack>
          <YStack flex={1} gap="$0.5">
            <H2 color="#0D0D0D" fontWeight="700" fontSize={22}>
              {displayName}
            </H2>
            <Caption color="#9CA3AF">{user?.email ?? ""}</Caption>
          </YStack>
          <LevelBadge level={currentLevel} size="sm" />
        </XStack>

        {/* XP Progress Card */}
        <Card elevated>
          <YStack gap="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <BodySmall fontWeight="700" color="#0D0D0D">
                {currentLevel.emoji} {getLevelDisplayName(currentLevel)}
              </BodySmall>
              <Caption color="#9CA3AF">
                {currentXP} / {nextLevelXP} XP
              </Caption>
            </XStack>
            <ProgressBar progress={progress} color="primary" height={10} />
            <XStack justifyContent="space-between" alignItems="center">
              <Caption color="#9CA3AF">{totalXP} Total XP</Caption>
              <XStack
                gap="$1"
                alignItems="center"
                onPress={() => router.push("/achievements")}
                pressStyle={{ opacity: 0.7 }}
              >
                <Caption>🏆</Caption>
                <Caption color="#F5A623" fontWeight="600">
                  {achievements.length}/14 {i18n._("profile.viewAll")} →
                </Caption>
              </XStack>
            </XStack>
          </YStack>
        </Card>

        {/* 4-stat chips */}
        <XStack gap="$2">
          <StatChip
            icon="🔥"
            value={`${currentStreak}d`}
            label={i18n._("profile.streak")}
          />
          <StatChip
            icon="📖"
            value={stats.sessionsCompleted}
            label={i18n._("profile.sessionsCompleted")}
          />
          <StatChip
            icon="📚"
            value={lists.length}
            label={i18n._("profile.listsCreated")}
          />
          <StatChip
            icon="🎯"
            value={stats.wordsMastered}
            label={i18n._("profile.wordsLearned")}
          />
        </XStack>

        {/* Summary row */}
        <Card>
          <XStack justifyContent="space-around" paddingVertical="$2">
            <YStack alignItems="center" gap="$1" flex={1}>
              <H3 color="#0D0D0D" fontWeight="700">
                {stats.wordsMastered}
              </H3>
              <Caption color="#9CA3AF" textAlign="center">
                {i18n._("profile.wordsLearned")}
              </Caption>
            </YStack>
            <YStack width={1} backgroundColor="#E5E7EB" />
            <YStack alignItems="center" gap="$1" flex={1}>
              <H3 color="#0D0D0D" fontWeight="700">
                {stats.sessionsCompleted}
              </H3>
              <Caption color="#9CA3AF" textAlign="center">
                {i18n._("profile.sessionsCompleted")}
              </Caption>
            </YStack>
            <YStack width={1} backgroundColor="#E5E7EB" />
            <YStack alignItems="center" gap="$1" flex={1}>
              <H3 color="#0D0D0D" fontWeight="700">{longestStreak}d</H3>
              <Caption color="#9CA3AF" textAlign="center">
                {i18n._("profile.longestStreak")}
              </Caption>
            </YStack>
          </XStack>
        </Card>

        {/* Recent Achievements */}
        <Card elevated>
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$3"
          >
            <H3 color="#0D0D0D">{i18n._("profile.recentAchievements")}</H3>
            <XStack
              onPress={() => router.push("/achievements")}
              pressStyle={{ opacity: 0.7 }}
            >
              <Caption color="#6B4EFF" fontWeight="600">
                {i18n._("profile.viewAll")} ›
              </Caption>
            </XStack>
          </XStack>
          {recentAchievements.length === 0 ? (
            <BodySmall color="#9CA3AF">
              {i18n._("profile.noAchievements")}
            </BodySmall>
          ) : (
            <XStack gap="$3" flexWrap="wrap">
              {recentAchievements.map((ua) => {
                const achievement = getAchievementById(ua.achievementId);
                if (!achievement) return null;
                return (
                  <YStack
                    key={ua.achievementId}
                    alignItems="center"
                    gap="$1"
                    flex={1}
                    minWidth={70}
                  >
                    <YStack
                      width={56}
                      height={56}
                      borderRadius={28}
                      backgroundColor="#FEF3E2"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Body fontSize={28}>{achievement.icon}</Body>
                    </YStack>
                    <Caption
                      textAlign="center"
                      numberOfLines={1}
                      color="#374151"
                    >
                      {i18n._(achievement.titleKey)}
                    </Caption>
                    <Caption color="#F5A623">+{ua.xpAwarded} XP</Caption>
                  </YStack>
                );
              })}
            </XStack>
          )}
        </Card>

        <OutlineButton
          onPress={signOut}
          marginTop="$2"
          borderColor="#E5E7EB"
          color="#6B7280"
        >
          {i18n._("common.logout")}
        </OutlineButton>
      </YStack>
    </ScrollView>
  );
}

