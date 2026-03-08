import { useLingui } from "@lingui/react";
import { Settings } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { LevelBadge } from "@/components/DesignSystem/Badge";
import { OutlineButton } from "@/components/DesignSystem/Button";
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
import { useSessionsStore } from "@/store/sessionsStore";
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

  const sessions = useSessionsStore((state) => state.sessions);

  const recentAchievements = [...achievements]
    .sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime(),
    )
    .slice(0, 4);

  const studyDays = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.completedAt) set.add(new Date(s.completedAt).toDateString());
    });
    return set;
  }, [sessions]);

  const weekDays = useMemo(() => {
    const today = new Date();
    const todayDow = today.getDay(); // 0=Sun
    const mondayOffset = todayDow === 0 ? -6 : 1 - todayDow;
    return ["M", "T", "W", "T", "F", "S", "S"].map((label, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      return {
        label,
        dateStr: d.toDateString(),
        isToday: mondayOffset + i === 0,
      };
    });
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: "#FFFFFF" }}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      <YStack padding="$4" gap="$4">
        {/* Settings gear */}
        <XStack justifyContent="flex-end" alignItems="center">
          <XStack
            onPress={() => router.push("/settings")}
            width={40}
            height={40}
            backgroundColor="#F8F8F8"
            borderRadius={20}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.7 }}
          >
            <Settings size={20} color="#D7D7D7" />
          </XStack>
        </XStack>

        {/* Avatar + Name + Badge */}
        <XStack alignItems="center" gap="$3">
          <XStack
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="#007AFF"
            alignItems="center"
            justifyContent="center"
          >
            <H2 color="white" fontSize={26} fontWeight="700">
              {initial}
            </H2>
          </XStack>
          <YStack flex={1} gap="$0.5">
            <H2 fontWeight="700" fontSize={22}>
              {displayName}
            </H2>
            <Caption color="#D7D7D7">{user?.email ?? ""}</Caption>
          </YStack>
          <LevelBadge level={currentLevel} size="sm" />
        </XStack>

        {/* XP Progress Card */}
        <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4" gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <BodySmall fontWeight="700" color="#131313">
              {currentLevel.emoji} {getLevelDisplayName(currentLevel)}
            </BodySmall>
            <Caption color="#D7D7D7">
              {currentXP} / {nextLevelXP} XP
            </Caption>
          </XStack>
          <ProgressBar progress={progress} color="primary" height={8} />
          <XStack justifyContent="space-between" alignItems="center">
            <Caption color="#D7D7D7">{totalXP} Total XP</Caption>
            <XStack
              gap="$1"
              alignItems="center"
              onPress={() => router.push("/achievements")}
              pressStyle={{ opacity: 0.7 }}
            >
              <Caption>🏆</Caption>
              <Caption color="#007AFF" fontWeight="600">
                {achievements.length}/14 {i18n._("profile.viewAll")} →
              </Caption>
            </XStack>
          </XStack>
        </YStack>

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

        {/* Weekly Study Calendar */}
        <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4" gap="$3">
          <Caption fontWeight="600" color="#D7D7D7" letterSpacing={0.5}>
            {i18n._("profile.thisWeek").toUpperCase()}
          </Caption>
          <XStack justifyContent="space-between">
            {weekDays.map(({ label, dateStr, isToday }, idx) => {
              const active = studyDays.has(dateStr);
              return (
                <YStack key={idx} alignItems="center" gap="$1">
                  <XStack
                    width={34}
                    height={34}
                    borderRadius={17}
                    backgroundColor={active ? "#007AFF" : "#FFFFFF"}
                    borderWidth={isToday && !active ? 1 : 0}
                    borderColor="#007AFF"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {active ? (
                      <Caption color="#FFFFFF" fontWeight="700" fontSize={13}>
                        ✓
                      </Caption>
                    ) : (
                      <Caption
                        color={isToday ? "#007AFF" : "#D7D7D7"}
                        fontSize={13}
                      >
                        •
                      </Caption>
                    )}
                  </XStack>
                  <Caption
                    color={isToday ? "#007AFF" : "#D7D7D7"}
                    fontSize={10}
                  >
                    {label}
                  </Caption>
                </YStack>
              );
            })}
          </XStack>
        </YStack>

        {/* Recent Achievements */}
        <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4">
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$3"
          >
            <H3>{i18n._("profile.recentAchievements")}</H3>
            <XStack
              onPress={() => router.push("/achievements")}
              pressStyle={{ opacity: 0.7 }}
            >
              <Caption color="#007AFF" fontWeight="600">
                {i18n._("profile.viewAll")} ›
              </Caption>
            </XStack>
          </XStack>
          {recentAchievements.length === 0 ? (
            <BodySmall color="#D7D7D7">
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
                      backgroundColor="#FFF5EB"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Body fontSize={28}>{achievement.icon}</Body>
                    </YStack>
                    <Caption textAlign="center" numberOfLines={1} color="#131313">
                      {i18n._(achievement.titleKey)}
                    </Caption>
                    <Caption color="#F5A623">+{ua.xpAwarded} XP</Caption>
                  </YStack>
                );
              })}
            </XStack>
          )}
        </YStack>

        <OutlineButton
          onPress={signOut}
          marginTop="$2"
          borderColor="#F2F2F2"
          color="#D53F36"
        >
          {i18n._("common.logout")}
        </OutlineButton>
      </YStack>
    </ScrollView>
  );
}
