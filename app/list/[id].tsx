import { useLingui } from "@lingui/react";
import { ArrowLeft, Play, Trash2 } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import { StatChip } from "@/components/DesignSystem/StatChip";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { analyticsService } from "@/services/analytics/analytics.service";
import {
  getCompletionPercent,
  getMasteredCount,
  useListsStore,
  type VocabWord,
  type WordStatus,
} from "@/store/listsStore";

function wordStatusColor(status: WordStatus): string {
  switch (status) {
    case "mastered":
      return "#38AD49";
    case "learned":
      return "#F5A623";
    case "learning":
      return "#007AFF";
    default:
      return "#D7D7D7";
  }
}

function wordStatusEmoji(status: WordStatus): string {
  switch (status) {
    case "mastered":
      return "⭐";
    case "learned":
      return "✅";
    case "learning":
      return "📖";
    default:
      return "⬜";
  }
}

interface WordRowProps {
  word: VocabWord;
  statusLabels: Record<WordStatus, string>;
}

function WordRow({ word, statusLabels }: WordRowProps) {
  return (
    <XStack
      paddingVertical="$3"
      borderBottomWidth={1}
      borderBottomColor="#F2F2F2"
      justifyContent="space-between"
      alignItems="center"
    >
      <YStack flex={1} marginRight="$2">
        <Label numberOfLines={1}>{word.term}</Label>
        <Caption color="#D7D7D7" numberOfLines={1}>
          {word.translation}
        </Caption>
      </YStack>
      <XStack
        alignItems="center"
        gap="$1"
        backgroundColor="#F8F8F8"
        borderRadius={8}
        paddingHorizontal="$2"
        paddingVertical="$1"
      >
        <Caption>{wordStatusEmoji(word.status)}</Caption>
        <Caption color={wordStatusColor(word.status)}>
          {statusLabels[word.status]}
        </Caption>
      </XStack>
    </XStack>
  );
}

export default function ListDetailScreen() {
  const { i18n } = useLingui();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lists = useListsStore((state) => state.lists);
  const deleteList = useListsStore((state) => state.deleteList);

  const list = lists.find((l) => l.id === id);

  if (!list) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Body>{i18n._("listDetail.notFound")}</Body>
      </YStack>
    );
  }

  const completion = getCompletionPercent(list);
  const masteredCount = getMasteredCount(list);
  const learnedCount = list.words.filter((w) => w.status === "learned").length;
  const learningCount = list.words.filter(
    (w) => w.status === "learning",
  ).length;
  const notStartedCount = list.words.filter(
    (w) => w.status === "not_started",
  ).length;

  const statusLabels: Record<WordStatus, string> = {
    mastered: i18n._("listDetail.mastered"),
    learned: i18n._("listDetail.learned"),
    learning: i18n._("listDetail.learning"),
    not_started: i18n._("listDetail.notStarted"),
  };

  const handleDelete = () => {
    Alert.alert(
      i18n._("listDetail.deleteTitle"),
      i18n._("listDetail.deleteConfirm"),
      [
        {
          text: i18n._("listDetail.cancel"),
          style: "cancel",
        },
        {
          text: i18n._("listDetail.delete"),
          style: "destructive",
          onPress: () => {
            analyticsService.track("list_deleted", { listId: id });
            deleteList(list.id);
            router.back();
          },
        },
      ],
    );
  };

  const handleFlashcards = () => {
    analyticsService.track("session_started", {
      mode: "flashcard",
      listId: id,
    });
    router.push({ pathname: "/session/flashcard", params: { listId: id } });
  };

  const handleQuiz = () => {
    analyticsService.track("session_started", { mode: "quiz", listId: id });
    router.push({ pathname: "/session/quiz", params: { listId: id } });
  };

  return (
    <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
      <YStack padding="$4" gap="$4">
        <XStack alignItems="center" gap="$3">
          <XStack
            onPress={() => router.back()}
            padding="$2"
            borderRadius={8}
            pressStyle={{ opacity: 0.7 }}
          >
            <ArrowLeft size={24} color="$color" />
          </XStack>
          <H2 flex={1} numberOfLines={2}>
            {list.name}
          </H2>
        </XStack>

        {list.description ? (
          <BodySmall color="#D7D7D7">{list.description}</BodySmall>
        ) : null}

        <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4">
          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <H3>{i18n._("listDetail.progress")}</H3>
              <Caption>{completion}%</Caption>
            </XStack>
            <ProgressBar
              progress={completion / 100}
              color={completion === 100 ? "success" : "primary"}
              height={10}
            />
            <XStack gap="$2" flexWrap="wrap">
              <StatChip
                icon="⭐"
                value={masteredCount}
                label={i18n._("listDetail.mastered")}
              />
              <StatChip
                icon="✅"
                value={learnedCount}
                label={i18n._("listDetail.learned")}
              />
              <StatChip
                icon="📖"
                value={learningCount}
                label={i18n._("listDetail.learning")}
              />
              <StatChip
                icon="⬜"
                value={notStartedCount}
                label={i18n._("listDetail.notStarted")}
              />
            </XStack>
          </YStack>
        </YStack>

        <XStack gap="$2">
          <PrimaryButton flex={1} onPress={handleFlashcards}>
            <XStack alignItems="center" gap="$2">
              <Play size={16} color="white" />
              <Body color="white">{i18n._("listDetail.startFlashcards")}</Body>
            </XStack>
          </PrimaryButton>
          <SecondaryButton flex={1} onPress={handleQuiz}>
            {i18n._("listDetail.startQuiz")}
          </SecondaryButton>
        </XStack>

        <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4">
          <H3 marginBottom="$2">
            {i18n._("listDetail.words")} ({list.words.length})
          </H3>
          {list.words.length === 0 ? (
            <BodySmall color="#D7D7D7">
              {i18n._("listDetail.noWords")}
            </BodySmall>
          ) : (
            <YStack>
              {list.words.map((word) => (
                <WordRow
                  key={word.id}
                  word={word}
                  statusLabels={statusLabels}
                />
              ))}
            </YStack>
          )}
        </YStack>

        <YStack
          pressStyle={{ opacity: 0.8 }}
          onPress={handleDelete}
          backgroundColor="#FFF0EF"
          borderRadius={12}
          padding="$4"
        >
          <XStack alignItems="center" gap="$3" justifyContent="center">
            <Trash2 size={18} color="#D53F36" />
            <Label color="#D53F36">{i18n._("listDetail.deleteList")}</Label>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
