import { useLingui } from "@lingui/react";
import { useState } from "react";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import { Body, Caption, H1, Label } from "@/components/DesignSystem/Typography";
import {
  getPredefinedListsByLocale,
  LIST_CATEGORIES,
  type ListCategory,
  type PredefinedList,
} from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useGameStore } from "@/store/gameStore";
import { useLanguageStore } from "@/store/languageStore";
import { useListsStore, type VocabWord } from "@/store/listsStore";

const CATEGORY_COLORS: Record<string, { bg: string; accent: string }> = {
  technology: { bg: "#E8F4FD", accent: "#1B6CA8" },
  business: { bg: "#FFF3E0", accent: "#E65100" },
  travel: { bg: "#E8F5E9", accent: "#2E7D32" },
  food: { bg: "#FFF8E1", accent: "#F57F17" },
  science: { bg: "#EDE7F6", accent: "#4527A0" },
  history: { bg: "#FCE4EC", accent: "#880E4F" },
  arts: { bg: "#E3F2FD", accent: "#0D47A1" },
  sports: { bg: "#F3E5F5", accent: "#6A1B9A" },
  dailyLife: { bg: "#F1F8E9", accent: "#33691E" },
  academic: { bg: "#FFF9C4", accent: "#F57F17" },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  technology: "💻",
  business: "💼",
  travel: "✈️",
  food: "🍽️",
  science: "🔬",
  history: "📜",
  arts: "🎨",
  sports: "⚽",
  dailyLife: "☀️",
  academic: "📖",
};

function ExploreListCard({
  list,
  isInLibrary,
  onAdd,
  addLabel,
  inLibraryLabel,
}: {
  list: PredefinedList;
  isInLibrary: boolean;
  onAdd: () => void;
  addLabel: string;
  inLibraryLabel: string;
}) {
  const colors = CATEGORY_COLORS[list.topicCategory] ?? {
    bg: "#F5F7FA",
    accent: "#374151",
  };
  const emoji = CATEGORY_EMOJIS[list.topicCategory] ?? "📚";

  return (
    <YStack
      flexBasis="47%"
      flexGrow={0}
      backgroundColor="#F8F8F8"
      borderRadius={12}
      padding="$3"
      gap="$2"
      alignItems="center"
      pressStyle={{ opacity: 0.85 }}
      onPress={isInLibrary ? undefined : onAdd}
    >
      <Body fontSize={40}>{emoji}</Body>
      <Label
        fontWeight="600"
        textAlign="center"
        numberOfLines={2}
        color="#131313"
      >
        {list.name}
      </Label>
      <Caption color="#D7D7D7">{list.words.length} words</Caption>
      {isInLibrary ? (
        <XStack
          backgroundColor="#E8FFF4"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius={100}
        >
          <Caption color="#38AD49" fontWeight="600">
            ✓ {inLibraryLabel}
          </Caption>
        </XStack>
      ) : (
        <XStack
          backgroundColor="#007AFF"
          paddingHorizontal="$3"
          paddingVertical="$1"
          borderRadius={100}
          pressStyle={{ opacity: 0.7 }}
        >
          <Caption color="#FFFFFF" fontWeight="600">
            + {addLabel}
          </Caption>
        </XStack>
      )}
    </YStack>
  );
}

export default function ExploreScreen() {
  const { i18n } = useLingui();
  const locale = useLanguageStore((state) => state.locale);
  const addList = useListsStore((state) => state.addList);
  const hasListFromSource = useListsStore((state) => state.hasListFromSource);
  const { awardXP, incrementStat, checkAndUnlockAchievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<ListCategory>("all");

  const predefinedLists = getPredefinedListsByLocale(locale);

  const categoryLabels = LIST_CATEGORIES.map((cat) => ({
    key: cat.key,
    label: i18n._(cat.labelKey),
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
    analyticsService.track("explore_list_added", {
      listId: predefined.id,
      listName: predefined.name,
      category: predefined.topicCategory,
    });
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#FFFFFF" }}
      contentContainerStyle={{ paddingBottom: 90 }}
    >
      <YStack padding="$4" gap="$4">
        <YStack>
          <H1>{i18n._("explore.title")}</H1>
          <Caption color="#D7D7D7">{i18n._("explore.subtitle")}</Caption>
        </YStack>

        <CategoryChips
          categories={categoryLabels}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <XStack gap="$3" flexWrap="wrap">
          {filteredLists.map((list) => (
            <ExploreListCard
              key={list.id}
              list={list}
              isInLibrary={hasListFromSource(list.id)}
              onAdd={() => handleAddToLibrary(list)}
              addLabel={i18n._("explore.addToLibrary")}
              inLibraryLabel={i18n._("explore.inLibrary")}
            />
          ))}
        </XStack>
      </YStack>
    </ScrollView>
  );
}
