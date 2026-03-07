import { useLingui } from "@lingui/react";
import { ArrowLeft, Minus, Plus } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, TextInput } from "react-native";
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
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
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
}

function createEmptyWord(): WordEntry {
  return { id: `w-${Date.now()}-${Math.random()}`, term: "", translation: "" };
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
    field: "term" | "translation",
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
      example: "",
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
    <ScrollView keyboardShouldPersistTaps="handled">
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
          <H2>{i18n._("createList.title")}</H2>
        </XStack>

        <Card elevated>
          <YStack gap="$3">
            <YStack gap="$1">
              <Label>{i18n._("createList.listName")}</Label>
              <YStack
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={8}
                padding="$3"
              >
                <TextInput
                  value={listName}
                  onChangeText={setListName}
                  placeholder={i18n._("createList.listNamePlaceholder")}
                  style={{ fontSize: 16 }}
                />
              </YStack>
            </YStack>

            <YStack gap="$1">
              <Label>{i18n._("createList.topic")}</Label>
              <YStack
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={8}
                padding="$3"
              >
                <TextInput
                  value={topic}
                  onChangeText={setTopic}
                  placeholder={i18n._("createList.topicPlaceholder")}
                  style={{ fontSize: 16 }}
                />
              </YStack>
            </YStack>
          </YStack>
        </Card>

        <Card elevated>
          <YStack gap="$2">
            <Label>{i18n._("createList.category")}</Label>
            <CategoryChips
              categories={nonAllCategories}
              selected={category}
              onSelect={(val) => setCategory(val as ListCategory)}
            />
          </YStack>
        </Card>

        <Card elevated>
          <YStack gap="$2">
            <Label>{i18n._("createList.language")}</Label>
            <XStack gap="$2" flexWrap="wrap">
              {LANGUAGE_OPTIONS.map((lang) => (
                <XStack
                  key={lang}
                  onPress={() => setLanguage(lang)}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius={8}
                  borderWidth={1}
                  borderColor={language === lang ? "$blue10" : "$gray6"}
                  backgroundColor={language === lang ? "$blue3" : "$background"}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Caption
                    color={language === lang ? "$blue10" : "$colorSubtitle"}
                  >
                    {lang}
                  </Caption>
                </XStack>
              ))}
            </XStack>
          </YStack>
        </Card>

        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <H3>{i18n._("createList.words")}</H3>
            <Caption color="$colorSubtitle">
              {words.filter((w) => w.term.trim()).length}{" "}
              {i18n._("createList.wordCount")}
            </Caption>
          </XStack>

          {words.map((word, index) => (
            <Card key={word.id} elevated>
              <YStack gap="$2">
                <XStack justifyContent="space-between" alignItems="center">
                  <BodySmall color="$colorSubtitle">#{index + 1}</BodySmall>
                  {words.length > 1 && (
                    <XStack
                      onPress={() => handleRemoveWord(word.id)}
                      pressStyle={{ opacity: 0.7 }}
                    >
                      <Minus size={16} color="$red10" />
                    </XStack>
                  )}
                </XStack>
                <YStack
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius={8}
                  padding="$3"
                >
                  <TextInput
                    value={word.term}
                    onChangeText={(val) =>
                      handleWordChange(word.id, "term", val)
                    }
                    placeholder={i18n._("createList.termPlaceholder")}
                    style={{ fontSize: 15 }}
                  />
                </YStack>
                <YStack
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius={8}
                  padding="$3"
                >
                  <TextInput
                    value={word.translation}
                    onChangeText={(val) =>
                      handleWordChange(word.id, "translation", val)
                    }
                    placeholder={i18n._("createList.translationPlaceholder")}
                    style={{ fontSize: 15 }}
                  />
                </YStack>
              </YStack>
            </Card>
          ))}

          <SecondaryButton onPress={handleAddWord}>
            <XStack alignItems="center" gap="$2">
              <Plus size={16} color="$blue10" />
              <Body color="$blue10">{i18n._("createList.addWord")}</Body>
            </XStack>
          </SecondaryButton>
        </YStack>

        <PrimaryButton onPress={handleSave} marginBottom="$4">
          {i18n._("createList.save")}
        </PrimaryButton>
      </YStack>
    </ScrollView>
  );
}
