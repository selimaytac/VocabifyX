import { useLingui } from "@lingui/react";
import { Minus, Plus, X } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TextInput, useColorScheme } from "react-native";
import { XStack, YStack } from "tamagui";

import { CategoryChips } from "@/components/DesignSystem/CategoryChip";
import { Body, Caption, H2 } from "@/components/DesignSystem/Typography";
import {
  LIST_CATEGORIES,
  type ListCategory,
} from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useGameStore } from "@/store/gameStore";
import { useListsStore, type VocabWord } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

interface WordEntry {
  id: string;
  term: string;
  translation: string;
  example: string;
}

function createEmptyWord(): WordEntry {
  return {
    id: `w-${Date.now()}-${Math.random()}`,
    term: "",
    translation: "",
    example: "",
  };
}

const LANGUAGE_OPTIONS = ["English", "Turkish", "Spanish", "French", "German"];

export default function CreateListScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const addList = useListsStore((state) => state.addList);
  const { incrementStat, checkAndUnlockAchievements } = useGameStore();
  const profile = useUserStore((state) => state.profile);

  const [listName, setListName] = useState("");
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<ListCategory>("daily_life");
  const [language, setLanguage] = useState("English");
  const [words, setWords] = useState<WordEntry[]>([
    createEmptyWord(),
    createEmptyWord(),
  ]);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const inputTextColor = isDark ? "#E5E7EB" : "#0D0D0D";
  const placeholderColor = isDark ? "#6B7280" : "#9CA3AF";

  const nonAllCategories = LIST_CATEGORIES.filter((c) => c.key !== "all").map(
    (c) => ({ key: c.key, label: i18n._(c.labelKey) }),
  );

  const handleAddWord = () => {
    setWords((prev) => [...prev, createEmptyWord()]);
  };

  const handleRemoveWord = (id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleWordChange = (
    id: string,
    field: "term" | "translation" | "example",
    value: string,
  ) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w)),
    );
  };

  const handleSave = () => {
    if (!listName.trim()) {
      Alert.alert(i18n._("createList.nameRequired"));
      return;
    }
    if (!topic.trim()) {
      Alert.alert(i18n._("createList.topicRequired"));
      return;
    }
    const filledWords = words.filter(
      (w) => w.term.trim() && w.translation.trim(),
    );
    if (filledWords.length === 0) {
      Alert.alert(i18n._("createList.wordsRequired"));
      return;
    }

    const vocabWords: VocabWord[] = filledWords.map((w, idx) => ({
      id: `${Date.now()}-${idx}`,
      term: w.term.trim(),
      translation: w.translation.trim(),
      example: w.example.trim(),
      difficulty: "beginner" as const,
      partOfSpeech: "word",
      status: "not_started" as const,
      timesCorrect: 0,
      timesWrong: 0,
    }));

    const newList = {
      id: `list-${Date.now()}`,
      name: listName.trim(),
      topic: topic.trim(),
      topicCategory: category,
      listLanguage: language,
      wordCount: vocabWords.length,
      source: "manual" as const,
      createdAt: new Date().toISOString(),
      words: vocabWords,
    };

    addList(newList);
    incrementStat("listsCreated");
    checkAndUnlockAchievements();
    analyticsService.track("list_created", {
      source: "manual",
      wordCount: vocabWords.length,
      category,
      userId: profile?.id,
    });

    router.back();
  };

  return (
    <ScrollView
      style={{ backgroundColor: "transparent" }}
      keyboardShouldPersistTaps="handled"
    >
      <YStack padding="$4" gap="$5">
        {/* Header */}
        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingTop="$2"
        >
          <H2>{i18n._("createList.title")}</H2>
          <XStack
            onPress={() => router.back()}
            backgroundColor="#F7F8FB"
            borderRadius={20}
            width={36}
            height={36}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.7 }}
          >
            <X size={18} color="#777777" />
          </XStack>
        </XStack>

        {/* Category chips */}
        <YStack gap="$2">
          <Body fontWeight="700" fontSize={15}>
            {i18n._("createList.category")}
          </Body>
          <CategoryChips
            categories={nonAllCategories}
            selected={category}
            onSelect={(val) => setCategory(val as ListCategory)}
            variant="scroll"
          />
        </YStack>

        {/* LIST NAME */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("createList.listName").toUpperCase()}
          </Caption>
          <YStack backgroundColor="$gray3" borderRadius={16} padding="$4">
            <TextInput
              value={listName}
              onChangeText={setListName}
              placeholder={i18n._("createList.listNamePlaceholder")}
              placeholderTextColor={placeholderColor}
              style={{ fontSize: 16, color: inputTextColor }}
            />
          </YStack>
        </YStack>

        {/* TOPIC */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("createList.topic").toUpperCase()}
          </Caption>
          <YStack backgroundColor="$gray3" borderRadius={16} padding="$4">
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder={i18n._("createList.topicPlaceholder")}
              placeholderTextColor={placeholderColor}
              style={{ fontSize: 16, color: inputTextColor }}
            />
          </YStack>
        </YStack>

        {/* LANGUAGE */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("createList.language").toUpperCase()}
          </Caption>
          <XStack gap="$2" flexWrap="wrap">
            {LANGUAGE_OPTIONS.map((lang) => (
              <XStack
                key={lang}
                onPress={() => setLanguage(lang)}
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius={100}
                borderWidth={1.5}
                borderColor={language === lang ? "#213448" : "$borderColor"}
                backgroundColor={language === lang ? "#213448" : "$background"}
                pressStyle={{ opacity: 0.7 }}
              >
                <Caption
                  color={language === lang ? "#FFFFFF" : "$colorSubtitle"}
                  fontWeight="600"
                  fontSize={13}
                >
                  {lang}
                </Caption>
              </XStack>
            ))}
          </XStack>
        </YStack>

        {/* WORDS */}
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
              {i18n._("createList.words").toUpperCase()}
            </Caption>
            <Caption color="$colorSubtitle" fontSize={12}>
              {words.filter((w) => w.term.trim()).length}{" "}
              {i18n._("createList.wordCount")}
            </Caption>
          </XStack>

          {words.map((word, index) => (
            <YStack
              key={word.id}
              backgroundColor="$gray3"
              borderRadius={16}
              padding="$4"
              gap="$3"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <Caption color="$colorSubtitle" fontSize={12}>
                  #{index + 1}
                </Caption>
                {words.length > 1 && (
                  <XStack
                    onPress={() => handleRemoveWord(word.id)}
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Minus size={16} color="#E5484D" />
                  </XStack>
                )}
              </XStack>
              <YStack
                backgroundColor="$background"
                borderRadius={8}
                padding="$3"
              >
                <TextInput
                  value={word.term}
                  onChangeText={(val) => handleWordChange(word.id, "term", val)}
                  placeholder={i18n._("createList.termPlaceholder")}
                  placeholderTextColor={placeholderColor}
                  style={{ fontSize: 15, color: inputTextColor }}
                />
              </YStack>
              <YStack
                backgroundColor="$background"
                borderRadius={8}
                padding="$3"
              >
                <TextInput
                  value={word.translation}
                  onChangeText={(val) =>
                    handleWordChange(word.id, "translation", val)
                  }
                  placeholder={i18n._("createList.translationPlaceholder")}
                  placeholderTextColor={placeholderColor}
                  style={{ fontSize: 15, color: inputTextColor }}
                />
              </YStack>
              <YStack
                backgroundColor="$background"
                borderRadius={8}
                padding="$3"
              >
                <TextInput
                  value={word.example}
                  onChangeText={(val) =>
                    handleWordChange(word.id, "example", val)
                  }
                  placeholder={i18n._("createList.examplePlaceholder")}
                  placeholderTextColor={placeholderColor}
                  style={{ fontSize: 15, color: inputTextColor }}
                  multiline
                />
              </YStack>
            </YStack>
          ))}

          {/* Add word */}
          <XStack
            onPress={handleAddWord}
            alignItems="center"
            justifyContent="center"
            gap="$2"
            paddingVertical="$4"
            borderRadius={16}
            borderWidth={1.5}
            borderColor="$borderColor"
            pressStyle={{ opacity: 0.7 }}
          >
            <Plus size={18} color="#213448" />
            <Body color="#213448" fontWeight="600" fontSize={15}>
              {i18n._("createList.addWord")}
            </Body>
          </XStack>
        </YStack>

        {/* Save button */}
        <XStack
          backgroundColor="#213448"
          borderRadius={100}
          height={52}
          alignItems="center"
          justifyContent="center"
          marginBottom="$4"
          pressStyle={{ opacity: 0.85 }}
          onPress={handleSave}
        >
          <Body color="#FFFFFF" fontWeight="700" fontSize={17}>
            {i18n._("createList.save")}
          </Body>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
