import { useLingui } from "@lingui/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  Label,
} from "@/components/DesignSystem/Typography";
import {
  type AchievementCondition,
  ACHIEVEMENTS,
} from "@/constants/achievements";
import {
  getLevelDisplayName,
  getLevelForXP,
  getXPForNextLevel,
} from "@/constants/levels";
import { type GameStats, useGameStore } from "@/store/gameStore";

type AchievementFilter = "all" | "streak" | "words" | "sessions";

function getConditionProgress(
  condition: AchievementCondition,
  stats: GameStats,
  currentStreak: number,
  levelNum: number,
): { current: number; target: number } {
  switch (condition.type) {
    case "lists_created":
      return {
        current: Math.min(stats.listsCreated, condition.count),
        target: condition.count,
      };
    case "words_mastered":
      return {
        current: Math.min(stats.wordsMastered, condition.count),
        target: condition.count,
      };
    case "sessions_completed":
      return {
        current: Math.min(stats.sessionsCompleted, condition.count),
        target: condition.count,
      };
    case "streak_days":
      return {
        current: Math.min(currentStreak, condition.count),
        target: condition.count,
      };
    case "lists_completed":
      return {
        current: Math.min(stats.listsCompleted, condition.count),
        target: condition.count,
      };
    case "explore_added":
      return {
        current: Math.min(stats.exploreAdded, condition.count),
        target: condition.count,
      };
    case "quiz_perfect":
      return {
        current: Math.min(stats.quizPerfectScores, condition.count),
        target: condition.count,
      };
    case "level_reached":
      return {
        current: Math.min(levelNum, condition.level),
        target: condition.level,
      };
  }
}

function matchesFilter(
  condition: AchievementCondition,
  filter: AchievementFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "streak") return condition.type === "streak_days";
  if (filter === "words")
    return (
      condition.type === "words_mastered" || condition.type === "quiz_perfect"
    );
  if (filter === "sessions")
    return (
      condition.type === "sessions_completed" ||
      condition.type === "lists_created" ||
      condition.type === "explore_added" ||
      condition.type === "lists_completed" ||
      condition.type === "level_reached"
    );
  return true;
}

export default function AchievementsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const [filter, setFilter] = useState<AchievementFilter>("all");
  const {
    achievements: unlockedList,
    totalXP,
    currentStreak,
    stats,
  } = useGameStore();

  const unlockedIds = new Set(unlockedList.map((a) => a.achievementId));
  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    unlockedIds.has(a.id),
  ).length;
  const totalXPFromAchievements = unlockedList.reduce(
    (sum, a) => sum + a.xpAwarded,
    0,
  );

  const currentLevel = getLevelForXP(totalXP);
  const levelName = getLevelDisplayName(currentLevel);
  const { currentXP, nextLevelXP } = getXPForNextLevel(totalXP);
  const levelProgress = nextLevelXP > 0 ? currentXP / nextLevelXP : 1;

  const filterCategories = [
    { key: "all", label: i18n._("achievements.filterAll") },
    { key: "streak", label: i18n._("achievements.filterStreak") },
    { key: "words", label: i18n._("achievements.filterWords") },
    { key: "sessions", label: i18n._("achievements.filterSessions") },
  ];

  const filteredAchievements = ACHIEVEMENTS.filter((a) =>
    matchesFilter(a.condition, filter),
  );

  // Tier-based header colors
  const tierColors: Record<string, { bg: string; text: string }> = {
    Bronze: { bg: "#8B6914", text: "#F5DEB3" },
    Silver: { bg: "#6B7280", text: "#F0F0F0" },
    Gold: { bg: "#B8860B", text: "#FFF8DC" },
    Platinum: { bg: "#6B46C1", text: "#EDE9FE" },
    Diamond: { bg: "#0E7490", text: "#E0F7FA" },
    Legend: { bg: "#B91C1C", text: "#FEF2F2" },
  };
  const tierStyle = tierColors[currentLevel.tier] ?? tierColors.Silver;

  return (
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      <YStack padding="$4" gap="$4" paddingBottom="$8">
        {/* Level header card */}
        <YStack
          backgroundColor={tierStyle.bg}
          borderRadius={16}
          padding="$4"
          gap="$3"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" gap="$3">
              <Body fontSize={32}>{currentLevel.emoji}</Body>
              <YStack>
                <Label color={tierStyle.text} fontWeight="700" fontSize={20}>
                  {levelName}
                </Label>
                <Caption color={tierStyle.text} opacity={0.8}>
                  Level {currentLevel.level}
                </Caption>
              </YStack>
            </XStack>
            <YStack alignItems="flex-end">
              <H2 color={tierStyle.text} fontWeight="700" fontSize={28}>
                {totalXP.toLocaleString()}
              </H2>
              <Caption color={tierStyle.text} opacity={0.8}>
                XP
              </Caption>
            </YStack>
          </XStack>
          <ProgressBar progress={levelProgress} color="success" height={6} />
          <Caption color={tierStyle.text} opacity={0.75} textAlign="right">
            {currentXP} / {nextLevelXP} XP
          </Caption>
        </YStack>

        {/* Summary stats */}
        <YStack
          backgroundColor="#FFFFFF"
          borderRadius={16}
          borderWidth={1}
          borderColor="#E5E7EB"
          overflow="hidden"
        >
          <XStack>
            <YStack flex={1} alignItems="center" padding="$3" gap="$1">
              <Body fontWeight="700" fontSize={22} color="#0D0D0D">
                {unlockedCount}
              </Body>
              <Caption color="#9CA3AF" fontSize={11}>
                {i18n._("achievements.unlocked")}
              </Caption>
            </YStack>
            <YStack width={1} backgroundColor="#E5E7EB" />
            <YStack flex={1} alignItems="center" padding="$3" gap="$1">
              <Body fontWeight="700" fontSize={22} color="#0D0D0D">
                {ACHIEVEMENTS.length}
              </Body>
              <Caption color="#9CA3AF" fontSize={11}>
                {i18n._("achievements.total")}
              </Caption>
            </YStack>
            <YStack width={1} backgroundColor="#E5E7EB" />
            <YStack flex={1} alignItems="center" padding="$3" gap="$1">
              <Body fontWeight="700" fontSize={22} color="#0D0D0D">
                {totalXPFromAchievements}
              </Body>
              <Caption color="#9CA3AF" fontSize={11}>
                {i18n._("achievements.xpEarned")}
              </Caption>
            </YStack>
          </XStack>
        </YStack>

        {/* Filter chips */}
        <CategoryChips
          categories={filterCategories}
          selected={filter}
          onSelect={(val) => setFilter(val as AchievementFilter)}
          variant="scroll"
        />

        {/* Achievement list */}
        <YStack gap="$2">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const { current, target } = getConditionProgress(
              achievement.condition,
              stats,
              currentStreak,
              currentLevel.level,
            );
            const progress = isUnlocked ? 1 : target > 0 ? current / target : 0;

            return (
              <YStack
                key={achievement.id}
                backgroundColor="#FFFFFF"
                borderRadius={16}
                borderWidth={1}
                borderColor="#E5E7EB"
                padding="$4"
                gap="$3"
                opacity={isUnlocked ? 1 : 0.7}
              >
                <XStack alignItems="center" gap="$3">
                  <XStack
                    width={52}
                    height={52}
                    borderRadius={26}
                    backgroundColor={
                      isUnlocked ? achievement.badgeColor : "#E5E7EB"
                    }
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Body fontSize={24}>
                      {isUnlocked ? achievement.icon : "🔒"}
                    </Body>
                  </XStack>
                  <YStack flex={1} gap="$1">
                    <XStack justifyContent="space-between" alignItems="center">
                      <Label fontWeight="700" color="#0D0D0D">
                        {i18n._(achievement.titleKey)}
                      </Label>
                      {isUnlocked ? (
                        <Body fontSize={18}>✅</Body>
                      ) : (
                        <Caption color="#9CA3AF" fontSize={11}>
                          {current}/{target}
                        </Caption>
                      )}
                    </XStack>
                    <BodySmall color="#9CA3AF">
                      {i18n._(achievement.descriptionKey)}
                    </BodySmall>
                  </YStack>
                </XStack>
                <ProgressBar
                  progress={progress}
                  color={isUnlocked ? "success" : "primary"}
                  height={4}
                />
              </YStack>
            );
          })}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
