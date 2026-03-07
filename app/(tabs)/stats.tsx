import { useLingui } from "@lingui/react";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { StatChip } from "@/components/DesignSystem/StatChip";
import {
  Body,
  BodySmall,
  Caption,
  H1,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { useGameStore } from "@/store/gameStore";
import { useListsStore } from "@/store/listsStore";
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
        <BodySmall color="$blue10">+{session.xpEarned} XP</BodySmall>
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
  const { totalXP, currentStreak, longestStreak, stats } = useGameStore();
  const lists = useListsStore((state) => state.lists);

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

  const flashcardSessions = periodSessions.filter(
    (s) => s.mode === "flashcard",
  ).length;
  const quizSessions = periodSessions.filter((s) => s.mode === "quiz").length;
  const totalPeriodSessions = periodSessions.length;
  const flashcardRatio =
    totalPeriodSessions > 0 ? flashcardSessions / totalPeriodSessions : 0;

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <H1>{i18n._("stats.title")}</H1>

        <CategoryChips
          categories={periodCategories}
          selected={selectedPeriod}
          onSelect={(val) => setSelectedPeriod(val as StatsPeriod)}
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
            <XStack gap="$2">
              <StatChip
                icon="📖"
                value={periodSessions.length}
                label={i18n._("stats.sessions")}
              />
              <StatChip
                icon="⚡"
                value={periodXP}
                label={i18n._("stats.xpEarned")}
              />
            </XStack>
            <XStack gap="$2">
              <StatChip
                icon="📝"
                value={periodWordsStudied}
                label={i18n._("stats.wordsStudied")}
              />
              <StatChip
                icon="⏱️"
                value={formatDuration(periodStudySeconds)}
                label={i18n._("stats.minutes")}
              />
            </XStack>

            {totalPeriodSessions > 0 && (
              <Card elevated>
                <H3 marginBottom="$3">{i18n._("stats.sessionBreakdown")}</H3>
                <YStack gap="$3">
                  <YStack gap="$1">
                    <XStack justifyContent="space-between">
                      <BodySmall>🃏 {i18n._("stats.flashcard")}</BodySmall>
                      <BodySmall>{flashcardSessions}</BodySmall>
                    </XStack>
                    <ProgressBar progress={flashcardRatio} color="primary" />
                  </YStack>
                  <YStack gap="$1">
                    <XStack justifyContent="space-between">
                      <BodySmall>🧠 {i18n._("stats.quiz")}</BodySmall>
                      <BodySmall>{quizSessions}</BodySmall>
                    </XStack>
                    <ProgressBar
                      progress={1 - flashcardRatio}
                      color="warning"
                    />
                  </YStack>
                </YStack>
              </Card>
            )}
          </>
        )}

        <Card elevated>
          <H3 marginBottom="$3">{i18n._("stats.allTimeTitle")}</H3>
          <XStack gap="$2">
            <StatChip
              icon="⚡"
              value={totalXP}
              label={i18n._("stats.totalXP")}
            />
            <StatChip
              icon="🎯"
              value={stats.wordsMastered}
              label={i18n._("stats.totalWords")}
            />
            <StatChip
              icon="📚"
              value={lists.length}
              label={i18n._("stats.totalLists")}
            />
          </XStack>
        </Card>

        <Card elevated>
          <H3 marginBottom="$3">{i18n._("stats.streakTitle")}</H3>
          <XStack gap="$2">
            <StatChip
              icon="🔥"
              value={`${currentStreak}`}
              label={i18n._("stats.currentStreak")}
            />
            <StatChip
              icon="🏅"
              value={`${longestStreak}`}
              label={i18n._("stats.bestStreak")}
            />
          </XStack>
        </Card>

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
