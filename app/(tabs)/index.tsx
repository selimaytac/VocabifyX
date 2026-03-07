import { useLingui } from "@lingui/react";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { StatChip } from "@/components/DesignSystem/StatChip";
import {
  Body,
  BodySmall,
  Caption,
  H1,
  H3,
} from "@/components/DesignSystem/Typography";
import { useGameStore } from "@/store/gameStore";
import {
  getCompletionPercent,
  useListsStore,
  type UserVocabList,
} from "@/store/listsStore";
import { useSessionsStore } from "@/store/sessionsStore";
import { useUserStore } from "@/store/userStore";

function ListCard({
  list,
  wordsLabel,
  flashcardsLabel,
  quizLabel,
}: {
  list: UserVocabList;
  wordsLabel: string;
  flashcardsLabel: string;
  quizLabel: string;
}) {
  const router = useRouter();
  const completion = getCompletionPercent(list);

  return (
    <Card
      elevated
      marginBottom="$3"
      pressStyle={{ opacity: 0.9 }}
      onPress={() =>
        router.push({ pathname: "/list/[id]", params: { id: list.id } })
      }
    >
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
          {list.words.length} {wordsLabel}
        </BodySmall>
        <XStack gap="$2" marginTop="$1">
          <PrimaryButton
            flex={1}
            size="$3"
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/session/flashcard",
                params: { listId: list.id },
              });
            }}
          >
            🃏 {flashcardsLabel}
          </PrimaryButton>
          <SecondaryButton
            flex={1}
            size="$3"
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/session/quiz",
                params: { listId: list.id },
              });
            }}
          >
            🧠 {quizLabel}
          </SecondaryButton>
        </XStack>
      </YStack>
    </Card>
  );
}

export default function HomeScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const lists = useListsStore((state) => state.lists);
  const { currentStreak } = useGameStore();
  const getSessionsToday = useSessionsStore((state) => state.getSessionsToday);

  const [todaySessions] = useState(() => getSessionsToday());
  const todayXP = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0);

  const displayName = profile?.displayName ?? "Learner";

  return (
    <YStack flex={1}>
      <ScrollView>
        <YStack padding="$4" gap="$4">
          <H1>
            👋 {i18n._("home.greeting")}, {displayName}!
          </H1>

          <XStack gap="$2">
            <StatChip
              icon="📖"
              value={todaySessions.length}
              label={i18n._("home.sessions")}
            />
            <StatChip
              icon="⚡"
              value={todayXP}
              label={i18n._("home.xpToday")}
            />
            <StatChip
              icon="🔥"
              value={currentStreak}
              label={i18n._("home.streak")}
            />
          </XStack>

          <XStack justifyContent="space-between" alignItems="center">
            <H3>{i18n._("home.myLists")}</H3>
            <XStack gap="$2" alignItems="center">
              <Caption>{lists.length} lists</Caption>
              <XStack
                onPress={() => router.push("/list/create")}
                backgroundColor="$blue10"
                borderRadius={20}
                width={32}
                height={32}
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.8 }}
              >
                <Plus size={18} color="white" />
              </XStack>
            </XStack>
          </XStack>

          {lists.length === 0 ? (
            <YStack alignItems="center" paddingVertical="$8" gap="$3">
              <Body fontSize={48}>📚</Body>
              <H3 textAlign="center">{i18n._("home.emptyTitle")}</H3>
              <BodySmall color="$colorSubtitle" textAlign="center">
                {i18n._("home.emptySubtitle")}
              </BodySmall>
              <PrimaryButton onPress={() => router.push("/list/create")}>
                + {i18n._("home.createList")}
              </PrimaryButton>
            </YStack>
          ) : (
            lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                wordsLabel={i18n._("home.words")}
                flashcardsLabel={i18n._("home.flashcards")}
                quizLabel={i18n._("home.quiz")}
              />
            ))
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
