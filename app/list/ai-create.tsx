import { useLingui } from "@lingui/react";
import { AlertCircle, ChevronDown, Sparkles, X } from "@tamagui/lucide-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  useColorScheme,
} from "react-native";
import { XStack, YStack } from "tamagui";

import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { LIST_CATEGORIES } from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import {
  type AIListResponse,
  generateAIList,
} from "@/services/api/ai-list.service";
import { useGameStore } from "@/store/gameStore";
import { useListsStore, type UserVocabList } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

interface LanguageOption {
  value: string;
  abbr: string;
  flag: string;
  nameKey: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "English", abbr: "EN", flag: "🇬🇧", nameKey: "English" },
  { value: "Turkish", abbr: "TR", flag: "🇹🇷", nameKey: "Turkish" },
  { value: "Spanish", abbr: "ES", flag: "🇪🇸", nameKey: "Spanish" },
  { value: "French", abbr: "FR", flag: "🇫🇷", nameKey: "French" },
  { value: "German", abbr: "DE", flag: "🇩🇪", nameKey: "German" },
];

const WORD_COUNT_OPTIONS = [10, 20, 30, 50];

type ScreenPhase = "form" | "loading" | "preview" | "error";

export default function AICreateListScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const addList = useListsStore((state) => state.addList);
  const { incrementStat, checkAndUnlockAchievements } = useGameStore();
  const profile = useUserStore((state) => state.profile);

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("daily_life");
  const [language, setLanguage] = useState("English");
  const [wordCount, setWordCount] = useState(20);
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState<ScreenPhase>("form");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedList, setGeneratedList] = useState<AIListResponse | null>(
    null,
  );
  const [langOpen, setLangOpen] = useState(false);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const inputTextColor = isDark ? "#E5E7EB" : "#0D0D0D";
  const placeholderColor = isDark ? "#6B7280" : "#9CA3AF";

  const categorySuggestions = LIST_CATEGORIES.filter(
    (c) => c.key !== "all",
  ).map((c) => ({ key: c.key, label: i18n._(c.labelKey) }));

  const selectedLang =
    LANGUAGE_OPTIONS.find((l) => l.value === language) ?? LANGUAGE_OPTIONS[0];

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      Alert.alert(i18n._("aiCreate.topicRequired"));
      return;
    }

    setPhase("loading");

    const messages = [
      i18n._("aiCreate.loading.analyzing"),
      i18n._("aiCreate.loading.generating"),
      i18n._("aiCreate.loading.refining"),
      i18n._("aiCreate.loading.almostReady"),
    ];
    let messageIndex = 0;
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, messages.length - 1);
      setLoadingMessage(messages[messageIndex]);
    }, 2500);

    try {
      const result = await generateAIList({
        topic: topic.trim(),
        language,
        wordCount,
        description: description.trim() || undefined,
      });

      clearInterval(interval);
      setGeneratedList(result);
      setPhase("preview");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => undefined,
      );
    } catch {
      clearInterval(interval);
      setPhase("error");
    }
  }, [topic, language, wordCount, description, i18n]);

  const handleSaveList = useCallback(() => {
    if (!generatedList) return;

    const newList: UserVocabList = {
      id: `list-ai-${Date.now()}`,
      name: generatedList.name,
      topic: generatedList.topic,
      topicCategory: category,
      listLanguage: language,
      wordCount: generatedList.words.length,
      source: "ai_generated",
      createdAt: new Date().toISOString(),
      words: generatedList.words,
    };

    addList(newList);
    incrementStat("listsCreated");
    checkAndUnlockAchievements();
    analyticsService.track("list_created", {
      source: "ai_generated",
      wordCount: generatedList.words.length,
      category,
      language,
      userId: profile?.id,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => undefined,
    );
    router.back();
  }, [
    generatedList,
    category,
    language,
    addList,
    incrementStat,
    checkAndUnlockAchievements,
    profile,
    router,
  ]);

  const handleRetry = () => {
    setPhase("form");
    setGeneratedList(null);
  };

  /* ───── LOADING PHASE ───── */
  if (phase === "loading") {
    return (
      <YStack
        flex={1}
        backgroundColor="#FFFFFF"
        alignItems="center"
        justifyContent="center"
        padding="$6"
        gap="$5"
      >
        <YStack
          width={96}
          height={96}
          borderRadius={48}
          backgroundColor="#E5F2FF"
          alignItems="center"
          justifyContent="center"
        >
          <Sparkles size={44} color="#547792" />
        </YStack>
        <H2 textAlign="center" color="#213448">
          {i18n._("aiCreate.loading.title")}
        </H2>
        <ActivityIndicator size="large" color="#213448" />
        <BodySmall color="#777777" textAlign="center">
          {loadingMessage}
        </BodySmall>
        <Caption color="#9CA3AF" textAlign="center" paddingTop="$4">
          {i18n._("aiCreate.loading.funFact")}
        </Caption>
      </YStack>
    );
  }

  /* ───── ERROR PHASE ───── */
  if (phase === "error") {
    return (
      <YStack
        flex={1}
        backgroundColor="#FFFFFF"
        alignItems="center"
        justifyContent="center"
        padding="$6"
        gap="$4"
      >
        <XStack
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor="#FFEAEA"
          alignItems="center"
          justifyContent="center"
        >
          <AlertCircle size={40} color="#BE3144" />
        </XStack>
        <H3 textAlign="center" color="#09122C">
          {i18n._("aiCreate.error.title")}
        </H3>
        <BodySmall color="#777777" textAlign="center">
          {i18n._("aiCreate.error.subtitle")}
        </BodySmall>
        <XStack
          backgroundColor="#213448"
          borderRadius={100}
          height={52}
          width="100%"
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.85 }}
          onPress={handleRetry}
          marginTop="$2"
        >
          <Body color="#FFFFFF" fontWeight="700" fontSize={16}>
            {i18n._("aiCreate.error.retry")}
          </Body>
        </XStack>
        <XStack
          alignItems="center"
          justifyContent="center"
          pressStyle={{ opacity: 0.7 }}
          onPress={() => router.back()}
          paddingVertical="$2"
        >
          <Body color="#777777" fontWeight="500" fontSize={15}>
            {i18n._("common.cancel")}
          </Body>
        </XStack>
      </YStack>
    );
  }

  /* ───── PREVIEW PHASE ───── */
  if (phase === "preview" && generatedList) {
    return (
      <YStack flex={1} backgroundColor="#FFFFFF">
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <YStack padding="$4" gap="$4">
            {/* Header */}
            <XStack
              alignItems="center"
              justifyContent="space-between"
              paddingTop="$2"
            >
              <H2>{i18n._("aiCreate.preview.title")}</H2>
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

            {/* List Info */}
            <YStack
              backgroundColor="#E5F2FF"
              borderRadius={16}
              padding="$4"
              gap="$2"
            >
              <H3 color="#213448">{generatedList.name}</H3>
              <Caption color="#547792">
                {generatedList.topic} · {generatedList.words.length}{" "}
                {i18n._("createList.wordCount")} · {language}
              </Caption>
            </YStack>

            {/* Words Preview */}
            <YStack gap="$2">
              <Label fontWeight="700" fontSize={13}>
                {i18n._("aiCreate.preview.wordsTitle")}
              </Label>
              {generatedList.words.map((word, index) => (
                <YStack
                  key={word.id}
                  backgroundColor="#F7F8FB"
                  borderRadius={12}
                  padding="$3"
                  gap="$1"
                  borderWidth={0.5}
                  borderColor="rgba(33, 52, 72, 0.06)"
                >
                  <XStack
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <YStack flex={1}>
                      <Body fontWeight="700" fontSize={15} color="#09122C">
                        {word.term}
                      </Body>
                      <BodySmall color="#547792">{word.translation}</BodySmall>
                    </YStack>
                    <Caption color="#9CA3AF">#{index + 1}</Caption>
                  </XStack>
                  {word.example ? (
                    <Caption color="#777777" fontStyle="italic">
                      {word.example}
                    </Caption>
                  ) : null}
                </YStack>
              ))}
            </YStack>
          </YStack>
        </ScrollView>

        {/* Save Button (fixed at bottom) */}
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          padding="$4"
          paddingBottom="$6"
          backgroundColor="#FFFFFF"
          borderTopWidth={1}
          borderTopColor="#E0E0E0"
        >
          <XStack
            backgroundColor="#213448"
            borderRadius={100}
            height={52}
            alignItems="center"
            justifyContent="center"
            pressStyle={{ opacity: 0.85 }}
            onPress={handleSaveList}
          >
            <Sparkles size={18} color="white" />
            <Body
              color="#FFFFFF"
              fontWeight="700"
              fontSize={17}
              marginLeft="$2"
            >
              {i18n._("aiCreate.preview.save")}
            </Body>
          </XStack>
        </YStack>
      </YStack>
    );
  }

  /* ───── FORM PHASE ───── */
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
          <XStack alignItems="center" gap="$2">
            <Sparkles size={22} color="#E17564" />
            <H2>{i18n._("aiCreate.title")}</H2>
          </XStack>
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

        {/* Subtitle */}
        <BodySmall color="#777777" marginTop={-12}>
          {i18n._("aiCreate.subtitle")}
        </BodySmall>

        {/* TOPIC / KEYWORDS */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("aiCreate.topicLabel").toUpperCase()}
          </Caption>
          <YStack backgroundColor="$gray3" borderRadius={16} padding="$4">
            <TextInput
              value={topic}
              onChangeText={setTopic}
              placeholder={i18n._("aiCreate.topicPlaceholder")}
              placeholderTextColor={placeholderColor}
              style={{ fontSize: 16, color: inputTextColor }}
            />
          </YStack>
        </YStack>

        {/* CATEGORY (Optional) */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("aiCreate.categoryLabel").toUpperCase()}
          </Caption>
          <YStack backgroundColor="$gray3" borderRadius={16} padding="$4">
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder={i18n._("createList.categoryPlaceholder")}
              placeholderTextColor={placeholderColor}
              style={{ fontSize: 15, color: inputTextColor }}
            />
          </YStack>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap="$2" paddingVertical="$1">
              {categorySuggestions.map((s) => {
                const isActive = category === s.key;
                return (
                  <XStack
                    key={s.key}
                    onPress={() => setCategory(isActive ? "" : s.key)}
                    paddingHorizontal="$3"
                    paddingVertical={6}
                    borderRadius={100}
                    borderWidth={1}
                    borderColor={isActive ? "#213448" : "$borderColor"}
                    backgroundColor={isActive ? "#213448" : "$background"}
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Caption
                      color={isActive ? "#FFFFFF" : "$colorSubtitle"}
                      fontWeight="600"
                      fontSize={12}
                    >
                      {s.label}
                    </Caption>
                  </XStack>
                );
              })}
            </XStack>
          </ScrollView>
        </YStack>

        {/* LIST LANGUAGE */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("aiCreate.languageLabel").toUpperCase()}
          </Caption>
          {/* Compact trigger */}
          <XStack
            onPress={() => setLangOpen((v) => !v)}
            backgroundColor="$gray3"
            borderRadius={16}
            padding="$3"
            alignItems="center"
            justifyContent="space-between"
            pressStyle={{ opacity: 0.8 }}
          >
            <XStack alignItems="center" gap="$2">
              <Caption fontSize={20}>{selectedLang.flag}</Caption>
              <Body fontSize={15} color={inputTextColor} fontWeight="500">
                {selectedLang.nameKey}
              </Body>
              <Caption color="$colorSubtitle" fontSize={13}>
                ({selectedLang.abbr})
              </Caption>
            </XStack>
            <ChevronDown
              size={16}
              color="#777777"
              style={{
                transform: [{ rotate: langOpen ? "180deg" : "0deg" }],
              }}
            />
          </XStack>
          {langOpen && (
            <YStack
              backgroundColor="$background"
              borderRadius={16}
              borderWidth={1}
              borderColor="$borderColor"
              overflow="hidden"
            >
              {LANGUAGE_OPTIONS.map((lang, idx) => {
                const isSelected = language === lang.value;
                return (
                  <XStack
                    key={lang.value}
                    onPress={() => {
                      setLanguage(lang.value);
                      setLangOpen(false);
                    }}
                    alignItems="center"
                    gap="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    backgroundColor={isSelected ? "#E5F2FF" : "transparent"}
                    borderTopWidth={idx === 0 ? 0 : 0.5}
                    borderTopColor="$borderColor"
                    pressStyle={{ opacity: 0.7 }}
                  >
                    <Caption fontSize={20}>{lang.flag}</Caption>
                    <Body
                      fontSize={15}
                      fontWeight={isSelected ? "700" : "400"}
                      color={isSelected ? "#213448" : "$color"}
                    >
                      {lang.nameKey}
                    </Body>
                    <Caption color="$colorSubtitle" fontSize={13}>
                      {lang.abbr}
                    </Caption>
                  </XStack>
                );
              })}
            </YStack>
          )}
        </YStack>

        {/* WORD COUNT */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("aiCreate.wordCountLabel").toUpperCase()}
          </Caption>
          <XStack gap="$2" flexWrap="wrap">
            {WORD_COUNT_OPTIONS.map((count) => (
              <XStack
                key={count}
                onPress={() => setWordCount(count)}
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius={100}
                borderWidth={1.5}
                borderColor={wordCount === count ? "#213448" : "$borderColor"}
                backgroundColor={
                  wordCount === count ? "#213448" : "$background"
                }
                alignItems="center"
                justifyContent="center"
                pressStyle={{ opacity: 0.7 }}
              >
                <Body
                  color={wordCount === count ? "#FFFFFF" : "$colorSubtitle"}
                  fontWeight="600"
                  fontSize={14}
                >
                  {count}
                </Body>
              </XStack>
            ))}
          </XStack>
        </YStack>

        {/* DESCRIPTION */}
        <YStack gap="$2">
          <Caption fontWeight="700" fontSize={11} letterSpacing={1}>
            {i18n._("aiCreate.descriptionLabel").toUpperCase()}
          </Caption>
          <YStack backgroundColor="$gray3" borderRadius={16} padding="$4">
            <TextInput
              value={description}
              onChangeText={(text) => setDescription(text.slice(0, 500))}
              placeholder={i18n._("aiCreate.descriptionPlaceholder")}
              placeholderTextColor={placeholderColor}
              style={{
                fontSize: 15,
                color: inputTextColor,
                minHeight: 80,
                textAlignVertical: "top",
              }}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </YStack>
          <Caption color="#9CA3AF" fontSize={11} textAlign="right">
            {description.length}/500
          </Caption>
        </YStack>

        {/* Generate Button */}
        <XStack
          backgroundColor="#E17564"
          borderRadius={100}
          height={56}
          alignItems="center"
          justifyContent="center"
          marginBottom="$4"
          pressStyle={{ opacity: 0.85 }}
          onPress={handleGenerate}
          gap="$2"
        >
          <Sparkles size={20} color="white" />
          <Body color="#FFFFFF" fontWeight="700" fontSize={17}>
            {i18n._("aiCreate.generateButton")}
          </Body>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
