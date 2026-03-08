import { useLingui } from "@lingui/react";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { PrimaryButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { Skeleton } from "@/components/DesignSystem/Skeleton";
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

function ListCardSkeleton() {
  return (
    <Card elevated marginBottom="$3">
      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} marginRight="$2" gap="$2">
            <Skeleton height={20} width="60%" borderRadius={6} />
            <Skeleton height={12} width="40%" borderRadius={6} />
          </YStack>
          <Skeleton height={22} width={60} borderRadius={100} />
        </XStack>
        <YStack gap="$1">
          <Skeleton height={6} borderRadius={3} />
          <Skeleton height={12} width="15%" borderRadius={6} />
        </YStack>
        <XStack gap="$2" marginTop="$1">
          <Skeleton height={32} borderRadius={100} />
          <Skeleton height={32} borderRadius={100} />
        </XStack>
      </YStack>
    </Card>
  );
}

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
      pressStyle={{ opacity: 0.95 }}
      onPress={() =>
        router.push({ pathname: "/list/[id]", params: { id: list.id } })
      }
    >
      <YStack gap="$3">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} marginRight="$2">
            <H3 numberOfLines={1}>{list.name}</H3>
            <Caption>{list.topic}</Caption>
          </YStack>
          <XStack
            backgroundColor={completion === 100 ? "$green3" : "$gray3"}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius={100}
          >
            <Caption
              color={completion === 100 ? "$green10" : "$colorSubtitle"}
              fontWeight="600"
            >
              {list.words.length} {wordsLabel}
            </Caption>
          </XStack>
        </XStack>

        <YStack gap="$1">
          <ProgressBar
            progress={completion / 100}
            color={completion === 100 ? "success" : "primary"}
            height={6}
          />
          <Caption color="$colorSubtitle">{completion}%</Caption>
        </YStack>

        <XStack gap="$2" marginTop="$1">
          <XStack
            flex={1}
            backgroundColor="#1B2D4F"
            borderRadius={100}
            paddingVertical="$2"
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.8 }}
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/session/flashcard",
                params: { listId: list.id },
              });
            }}
          >
            <Caption color="white" fontWeight="700">
              🃏 {flashcardsLabel}
            </Caption>
          </XStack>
          <XStack
            flex={1}
            backgroundColor="$gray3"
            borderRadius={100}
            paddingVertical="$2"
            justifyContent="center"
            alignItems="center"
            pressStyle={{ opacity: 0.8 }}
            onPress={(e) => {
              e.stopPropagation();
              router.push({
                pathname: "/session/quiz",
                params: { listId: list.id },
              });
            }}
          >
            <Caption color="$color" fontWeight="700">
              🧠 {quizLabel}
            </Caption>
          </XStack>
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
  const hasHydrated = useListsStore((state) => state._hasHydrated);
  const { currentStreak } = useGameStore();
  const getSessionsToday = useSessionsStore((state) => state.getSessionsToday);

  const [todaySessions] = useState(() => getSessionsToday());
  const todayXP = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0);

  const displayName = profile?.displayName ?? "Learner";

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <YStack padding="$4" gap="$4">
          {/* Greeting */}
          <YStack paddingTop="$2" gap="$1">
            <H1 fontSize={28} fontWeight="700">
              {i18n._("home.greeting")}, {displayName}! 👋
            </H1>
          </YStack>

          {/* Stat chips */}
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

          {/* My Lists header */}
          <XStack justifyContent="space-between" alignItems="center">
            <H3>{i18n._("home.myLists")}</H3>
            <XStack gap="$2" alignItems="center">
              <Caption color="$colorSubtitle">{lists.length} lists</Caption>
              <XStack
                onPress={() => router.push("/list/create")}
                backgroundColor="#1B2D4F"
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

          {!hasHydrated ? (
            <>
              <ListCardSkeleton />
              <ListCardSkeleton />
              <ListCardSkeleton />
            </>
          ) : lists.length === 0 ? (
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
