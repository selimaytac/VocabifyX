import { Plus } from "@tamagui/lucide-icons";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { PrimaryButton, SecondaryButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
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
import {
  getCompletionPercent,
  type UserVocabList,
  useListsStore,
} from "@/store/listsStore";
import { useSessionsStore } from "@/store/sessionsStore";
import { useUserStore } from "@/store/userStore";

function ListCard({ list }: { list: UserVocabList }) {
  const completion = getCompletionPercent(list);

  return (
    <Card elevated marginBottom="$3">
      <YStack gap="$2">
        <H3 numberOfLines={1}>{list.name}</H3>
        <Caption>{list.topic}</Caption>
        <XStack alignItems="center" gap="$2">
          <YStack flex={1}>
            <ProgressBar
              progress={completion / 100}
              color={completion === 100 ? "success" : "primary"}
            />
          </YStack>
          <Caption>{completion}%</Caption>
        </XStack>
        <BodySmall color="$colorSubtitle">
          {list.words.length} words
        </BodySmall>
      </YStack>
    </Card>
  );
}

function EmptyState() {
  return (
    <YStack alignItems="center" paddingVertical="$8" gap="$3">
      <Body fontSize={48}>📚</Body>
      <H3 textAlign="center">No lists yet</H3>
      <BodySmall color="$colorSubtitle" textAlign="center">
        Create your first vocabulary list to get started!
      </BodySmall>
    </YStack>
  );
}

export default function HomeScreen() {
  const profile = useUserStore((state) => state.profile);
  const lists = useListsStore((state) => state.lists);
  const { totalXP, currentStreak } = useGameStore();
  const getSessionsToday = useSessionsStore((state) => state.getSessionsToday);

  const [todaySessions] = useState(() => getSessionsToday());
  const todayXP = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0);

  const displayName = profile?.displayName ?? "Learner";

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <H1>👋 Hello, {displayName}!</H1>

        <XStack gap="$2">
          <StatChip
            icon="📖"
            value={todaySessions.length}
            label="Sessions"
          />
          <StatChip icon="⚡" value={todayXP} label="XP Today" />
          <StatChip
            icon="🔥"
            value={currentStreak}
            label="Streak"
          />
        </XStack>

        <XStack justifyContent="space-between" alignItems="center">
          <H3>My Lists</H3>
          <Caption>{lists.length} lists</Caption>
        </XStack>

        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          lists.map((list) => <ListCard key={list.id} list={list} />)
        )}
      </YStack>
    </ScrollView>
  );
}
