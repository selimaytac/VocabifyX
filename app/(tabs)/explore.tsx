import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import {
  Body,
  BodySmall,
  Caption,
  H1,
  H3,
} from "@/components/DesignSystem/Typography";
import {
  getPredefinedListsByLocale,
  LIST_CATEGORIES,
  type ListCategory,
  type PredefinedList,
} from "@/constants/predefined-lists";
import { useGameStore } from "@/store/gameStore";
import { useLanguageStore } from "@/store/languageStore";
import { useListsStore, type VocabWord } from "@/store/listsStore";

function ExploreListCard({
  list,
  isInLibrary,
  onAdd,
}: {
  list: PredefinedList;
  isInLibrary: boolean;
  onAdd: () => void;
}) {
  return (
    <Card elevated marginBottom="$3">
      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} marginRight="$2">
            <H3 numberOfLines={1}>{list.name}</H3>
            <Caption>{list.topic}</Caption>
          </YStack>
          <Caption>{list.words.length} words</Caption>
        </XStack>

        <BodySmall color="$colorSubtitle" numberOfLines={2}>
          {list.description}
        </BodySmall>

        <XStack gap="$2" flexWrap="wrap">
          {list.words.slice(0, 3).map((word) => (
            <XStack
              key={word.id}
              backgroundColor="$gray3"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius={8}
            >
              <Caption>{word.term}</Caption>
            </XStack>
          ))}
          {list.words.length > 3 && (
            <Caption color="$colorSubtitle">
              +{list.words.length - 3} more
            </Caption>
          )}
        </XStack>

        {isInLibrary ? (
          <SecondaryButton size="$3" disabled opacity={0.6}>
            ✓ In Library
          </SecondaryButton>
        ) : (
          <PrimaryButton size="$3" onPress={onAdd}>
            + Add to Library
          </PrimaryButton>
        )}
      </YStack>
    </Card>
  );
}

export default function ExploreScreen() {
  const locale = useLanguageStore((state) => state.locale);
  const addList = useListsStore((state) => state.addList);
  const hasListFromSource = useListsStore((state) => state.hasListFromSource);
  const { awardXP, incrementStat, checkAndUnlockAchievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<ListCategory>("all");

  const predefinedLists = getPredefinedListsByLocale(locale);

  const categoryLabels = LIST_CATEGORIES.map((cat) => ({
    key: cat.key,
    label:
      cat.key === "all"
        ? "All"
        : cat.key === "travel"
          ? "Travel"
          : cat.key === "business"
            ? "Business"
            : cat.key === "technology"
              ? "Technology"
              : cat.key === "daily_life"
                ? "Daily Life"
                : "Academic",
  }));

  const filteredLists =
    selectedCategory === "all"
      ? predefinedLists
      : predefinedLists.filter(
          (list) => list.topicCategory === selectedCategory,
        );

  const handleAddToLibrary = (predefined: PredefinedList) => {
    const words: VocabWord[] = predefined.words.map((w) => ({
      ...w,
      status: "not_started" as const,
      timesCorrect: 0,
      timesWrong: 0,
    }));

    addList({
      id: `list-${Date.now()}`,
      name: predefined.name,
      topic: predefined.topic,
      topicCategory: predefined.topicCategory,
      description: predefined.description,
      listLanguage: predefined.listLanguage,
      wordCount: words.length,
      source: "explore",
      sourceId: predefined.id,
      createdAt: new Date().toISOString(),
      words,
    });

    awardXP(5);
    incrementStat("exploreAdded");
    checkAndUnlockAchievements();
  };

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <YStack>
          <H1>Explore</H1>
          <Body color="$colorSubtitle">Discover curated vocabulary lists</Body>
        </YStack>

        <CategoryChips
          categories={categoryLabels}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {filteredLists.map((list) => (
          <ExploreListCard
            key={list.id}
            list={list}
            isInLibrary={hasListFromSource(list.id)}
            onAdd={() => handleAddToLibrary(list)}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
