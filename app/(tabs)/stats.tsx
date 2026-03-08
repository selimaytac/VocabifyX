import { useLingui } from "@lingui/react";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import {
  Body,
  BodySmall,
  Caption,
  H1,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { useGameStore } from "@/store/gameStore";
import { type LearningSession, useSessionsStore } from "@/store/sessionsStore";

type StatsPeriod = "today" | "week" | "allTime";

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}`;
}

function getSessionsForPeriod(
  sessions: LearningSession[],
  period: StatsPeriod,
): LearningSession[] {
  const now = new Date();
  if (period === "today") {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return sessions.filter(
      (s) => s.completedAt && new Date(s.completedAt) >= today,
    );
  }
  if (period === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    return sessions.filter(
      (s) => s.completedAt && new Date(s.completedAt) >= weekAgo,
    );
  }
  return sessions;
}

interface SessionRowProps {
  session: LearningSession;
  flashcardLabel: string;
  quizLabel: string;
  minutesLabel: string;
}

function SessionRow({
  session,
  flashcardLabel,
  quizLabel,
  minutesLabel,
}: SessionRowProps) {
  const icon = session.mode === "flashcard" ? "🃏" : "🧠";
  const modeLabel = session.mode === "flashcard" ? flashcardLabel : quizLabel;
  const date = session.completedAt
    ? new Date(session.completedAt).toLocaleDateString()
    : "";
  const durationMin = Math.floor(session.duration / 60);

  return (
    <XStack
      paddingVertical="$2"
      borderBottomWidth={1}
      borderBottomColor="$gray4"
      justifyContent="space-between"
      alignItems="center"
    >
      <XStack gap="$3" alignItems="center" flex={1}>
        <Body fontSize={20}>{icon}</Body>
        <YStack flex={1}>
          <Label>{modeLabel}</Label>
          <Caption color="$colorSubtitle">{date}</Caption>
        </YStack>
      </XStack>
      <YStack alignItems="flex-end">
        <BodySmall color="#F5A623">+{session.xpEarned} XP</BodySmall>
        <Caption color="$colorSubtitle">
          {durationMin} {minutesLabel}
        </Caption>
      </YStack>
    </XStack>
  );
}

export default function StatsScreen() {
  const { i18n } = useLingui();
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>("today");
  const sessions = useSessionsStore((state) => state.sessions);
  const { totalXP, currentStreak, longestStreak, achievements } =
    useGameStore();

  const periodCategories = [
    { key: "today", label: i18n._("stats.today") },
    { key: "week", label: i18n._("stats.thisWeek") },
    { key: "allTime", label: i18n._("stats.allTime") },
  ];

  const periodSessions = getSessionsForPeriod(sessions, selectedPeriod);
  const periodXP = periodSessions.reduce((sum, s) => sum + s.xpEarned, 0);
  const periodWordsStudied = periodSessions.reduce(
    (sum, s) => sum + s.wordsReviewed,
    0,
  );
  const periodStudySeconds = periodSessions.reduce(
    (sum, s) => sum + s.duration,
    0,
  );

  const recentSessions = [...sessions]
    .filter((s) => s.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime(),
    )
    .slice(0, 10);

  return (
    <ScrollView
      style={{ backgroundColor: "transparent" }}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <YStack padding="$4" gap="$4">
        <H1>{i18n._("stats.title")}</H1>

        <CategoryChips
          categories={periodCategories}
          selected={selectedPeriod}
          onSelect={(val) => setSelectedPeriod(val as StatsPeriod)}
          variant="segmented"
        />

        {periodSessions.length === 0 ? (
          <YStack alignItems="center" paddingVertical="$8" gap="$3">
            <Body fontSize={48}>📊</Body>
            <H3 textAlign="center">{i18n._("stats.noSessions")}</H3>
            <BodySmall color="$colorSubtitle" textAlign="center">
              {i18n._("stats.noSessionsSubtitle")}
            </BodySmall>
          </YStack>
        ) : (
          <>
            {/* Summary Card */}
            <Card elevated>
              <YStack gap="$4">
                {/* 3-column top row */}
                <XStack justifyContent="space-between">
                  <YStack alignItems="center" flex={1} gap="$1">
                    <Caption
                      fontWeight="700"
                      color="#10B981"
                      letterSpacing={0.5}
                    >
                      {i18n._("stats.xpEarned")}
                    </Caption>
                    <H3 fontWeight="800">⚡{periodXP}</H3>
                  </YStack>
                  <YStack alignItems="center" flex={1} gap="$1">
                    <Caption
                      fontWeight="700"
                      color="#F97316"
                      letterSpacing={0.5}
                    >
                      {i18n._("stats.streakLabel")}
                    </Caption>
                    <H3 fontWeight="800">🔥{currentStreak}</H3>
                    <Caption color="$colorSubtitle">
                      {i18n._("stats.bestStreak")}: {longestStreak}
                    </Caption>
                  </YStack>
                  <YStack alignItems="center" flex={1} gap="$1">
                    <Caption
                      fontWeight="700"
                      color="#8B5CF6"
                      letterSpacing={0.5}
                    >
                      {i18n._("stats.pointsLabel")}
                    </Caption>
                    <H3 fontWeight="800">⭐{totalXP}</H3>
                  </YStack>
                </XStack>

                {/* Bottom stats grid */}
                <XStack
                  backgroundColor="$gray3"
                  borderRadius={16}
                  padding="$3"
                  justifyContent="space-around"
                >
                  <YStack alignItems="center" gap="$1">
                    <Caption color="$colorSubtitle" fontWeight="600">
                      {i18n._("stats.sessions").toUpperCase()}
                    </Caption>
                    <H3 fontWeight="700">{periodSessions.length}</H3>
                  </YStack>
                  <YStack width={1} backgroundColor="$borderColor" />
                  <YStack alignItems="center" gap="$1">
                    <Caption color="$colorSubtitle" fontWeight="600">
                      {i18n._("stats.wordsLabel")}
                    </Caption>
                    <H3 fontWeight="700">{periodWordsStudied}</H3>
                  </YStack>
                  <YStack width={1} backgroundColor="$borderColor" />
                  <YStack alignItems="center" gap="$1">
                    <Caption color="$colorSubtitle" fontWeight="600">
                      {i18n._("stats.minutesLabel")}
                    </Caption>
                    <H3 fontWeight="700">
                      {formatDuration(periodStudySeconds)}
                    </H3>
                  </YStack>
                </XStack>
              </YStack>
            </Card>
          </>
        )}

        {/* Achievement Progress Card */}
        <Card elevated>
          <XStack alignItems="center" gap="$3" marginBottom="$3">
            <YStack
              width={44}
              height={44}
              borderRadius={12}
              backgroundColor="#EDE9FE"
              alignItems="center"
              justifyContent="center"
            >
              <Body fontSize={22}>🏆</Body>
            </YStack>
            <H3>{i18n._("stats.achievementProgress")}</H3>
          </XStack>
          <XStack gap="$3">
            <YStack
              flex={1}
              alignItems="center"
              gap="$1"
              backgroundColor="$gray3"
              borderRadius={16}
              padding="$3"
            >
              <H3 fontWeight="800">{achievements.length}</H3>
              <Caption color="$colorSubtitle">
                {i18n._("stats.totalUnlocked")}
              </Caption>
            </YStack>
            <YStack
              flex={1}
              alignItems="center"
              gap="$1"
              backgroundColor="#FEF3E2"
              borderRadius={16}
              padding="$3"
            >
              <H3 color="#F5A623" fontWeight="800">
                ⭐ {totalXP}
              </H3>
              <Caption color="$colorSubtitle">
                {i18n._("stats.totalXP")}
              </Caption>
            </YStack>
          </XStack>
        </Card>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <Card elevated>
            <H3 marginBottom="$3">{i18n._("stats.recentSessions")}</H3>
            <YStack>
              {recentSessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                  flashcardLabel={i18n._("stats.flashcard")}
                  quizLabel={i18n._("stats.quiz")}
                  minutesLabel={i18n._("stats.minutes")}
                />
              ))}
            </YStack>
          </Card>
        )}
      </YStack>
    </ScrollView>
  );
}
