import { useLingui } from "@lingui/react";
import { Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { PrimaryButton } from "@/components/DesignSystem/Button";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { Skeleton } from "@/components/DesignSystem/Skeleton";
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
  useListsStore,
  type UserVocabList,
} from "@/store/listsStore";
import { useSessionsStore } from "@/store/sessionsStore";
import { useUserStore } from "@/store/userStore";

function ListCardSkeleton() {
  return (
    <YStack
      backgroundColor="#F7F8FB"
      borderRadius={16}
      padding="$4"
      marginBottom="$3"
      gap="$3"
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1} marginRight="$2" gap="$2">
          <Skeleton height={20} width="60%" borderRadius={6} />
          <Skeleton height={12} width="40%" borderRadius={6} />
        </YStack>
        <Skeleton height={22} width={60} borderRadius={100} />
      </XStack>
      <YStack gap="$1">
        <Skeleton height={4} borderRadius={3} />
        <Skeleton height={12} width="15%" borderRadius={6} />
      </YStack>
      <XStack gap="$2" marginTop="$1">
        <Skeleton height={40} borderRadius={12} />
        <Skeleton height={40} borderRadius={12} />
      </XStack>
    </YStack>
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
    <YStack
      backgroundColor="#F7F8FB"
      borderRadius={16}
      padding="$4"
      marginBottom="$3"
      gap="$3"
      pressStyle={{ opacity: 0.95 }}
      onPress={() =>
        router.push({ pathname: "/list/[id]", params: { id: list.id } })
      }
      borderWidth={0.5}
      borderColor="rgba(33, 52, 72, 0.06)"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.05}
      shadowRadius={4}
      elevation={2}
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1} marginRight="$2">
          <H3 numberOfLines={1}>{list.name}</H3>
          <Caption color="#777777">{list.topic}</Caption>
        </YStack>
        <XStack
          backgroundColor={completion === 100 ? "#E8FFF4" : "#F7F8FB"}
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius={100}
          borderWidth={1}
          borderColor={completion === 100 ? "#4CAF50" : "#E0E0E0"}
        >
          <Caption
            color={completion === 100 ? "#4CAF50" : "#777777"}
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
          height={4}
        />
        <Caption color="#777777">{completion}%</Caption>
      </YStack>

      <XStack gap="$2" marginTop="$1">
        <XStack
          flex={1}
          backgroundColor="#213448"
          borderRadius={10}
          paddingVertical="$2.5"
          justifyContent="center"
          alignItems="center"
          pressStyle={{ opacity: 0.85 }}
          onPress={(e) => {
            e.stopPropagation();
            router.push({
              pathname: "/session/flashcard",
              params: { listId: list.id },
            });
          }}
        >
          <Label color="#FFFFFF" fontWeight="600">
            {flashcardsLabel}
          </Label>
        </XStack>
        <XStack
          flex={1}
          backgroundColor="#FFFFFF"
          borderRadius={10}
          borderWidth={1}
          borderColor="#E0E0E0"
          paddingVertical="$2.5"
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
          <Label color="#09122C" fontWeight="600">
            {quizLabel}
          </Label>
        </XStack>
      </XStack>
    </YStack>
  );
}

export default function HomeScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const lists = useListsStore((state) => state.lists);
  const hasHydrated = useListsStore((state) => state._hasHydrated);
  const { currentStreak } = useGameStore();
  const sessions = useSessionsStore((state) => state.sessions);

  const todaySessions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter(
      (s) => s.completedAt && new Date(s.completedAt) >= today,
    );
  }, [sessions]);

  const todayXP = todaySessions.reduce((sum, s) => sum + s.xpEarned, 0);

  const displayName = profile?.displayName ?? "Learner";

  return (
    <YStack flex={1} backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
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

          {/* Saved vocabulary info card */}
          <XStack
            backgroundColor="#E5F2FF"
            borderRadius={16}
            padding="$3"
            alignItems="center"
            gap="$3"
          >
            <XStack
              width={40}
              height={40}
              borderRadius={10}
              backgroundColor="#213448"
              alignItems="center"
              justifyContent="center"
            >
              <Body fontSize={20}>📚</Body>
            </XStack>
            <YStack flex={1}>
              <Label color="#09122C">{i18n._("home.myLists")}</Label>
              <Caption color="#547792">{lists.length} lists saved</Caption>
            </YStack>
            <XStack
              onPress={() => router.push("/list/create")}
              backgroundColor="#213448"
              borderRadius={20}
              width={32}
              height={32}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ opacity: 0.85 }}
            >
              <Plus size={18} color="white" />
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
              <BodySmall color="#777777" textAlign="center">
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
