import { useLingui } from "@lingui/react";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { XStack, YStack } from "tamagui";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import type { PredefinedList } from "@/constants/predefined-lists";
import { getPredefinedListsByLocale } from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import { requestNotificationPermission } from "@/services/notifications/notifications.service";
import { useGameStore } from "@/store/gameStore";
import { useLanguageStore } from "@/store/languageStore";
import type { VocabWord } from "@/store/listsStore";
import { useListsStore } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

// React Native exposes timer functions globally but the "esnext" tsconfig lib
// does not include them. Declare minimal types here to avoid ts-expect-error.
declare function setTimeout(callback: () => void, ms?: number): number;
declare function clearTimeout(id: number): void;
declare function setInterval(callback: () => void, ms?: number): number;
declare function clearInterval(id: number): void;

type OnboardingStep = "welcome" | "name" | "purpose" | "topic" | "loading";

type LearningPurpose = "work" | "travel" | "education" | "personal";
type TopicCategory =
  | "travel"
  | "business"
  | "technology"
  | "health"
  | "academic"
  | "other";
type WordCount = 15 | 30 | 50;

// loading sub-phases: "A" = generating animation, "B" = list preview
type LoadingPhase = "A" | "B";

const TOTAL_STEPS = 4;

const STEP_NUMBER: Partial<Record<OnboardingStep, number>> = {
  name: 1,
  purpose: 2,
  topic: 3,
  loading: 4,
};

const RESUMABLE_STEPS: OnboardingStep[] = [
  "name",
  "purpose",
  "topic",
  "loading",
];

const PURPOSE_OPTIONS: {
  key: LearningPurpose;
  emoji: string;
  labelKey: string;
}[] = [
  { key: "work", emoji: "💼", labelKey: "onboarding.purpose.work" },
  { key: "travel", emoji: "✈️", labelKey: "onboarding.purpose.travel" },
  { key: "education", emoji: "📚", labelKey: "onboarding.purpose.education" },
  { key: "personal", emoji: "🌟", labelKey: "onboarding.purpose.personal" },
];

const CATEGORY_OPTIONS: {
  key: TopicCategory;
  labelKey: string;
}[] = [
  { key: "travel", labelKey: "onboarding.topic.category.travel" },
  { key: "business", labelKey: "onboarding.topic.category.business" },
  { key: "technology", labelKey: "onboarding.topic.category.technology" },
  { key: "health", labelKey: "onboarding.topic.category.health" },
  { key: "academic", labelKey: "onboarding.topic.category.academic" },
  { key: "other", labelKey: "onboarding.topic.category.other" },
];

const WORD_COUNT_OPTIONS: WordCount[] = [15, 30, 50];

const TOPIC_PLACEHOLDERS = [
  "Germany Travel",
  "AI Fundamentals",
  "Legal English",
  "Crypto Basics",
  "Medical Terms",
  "Business Finance",
];

const LOADING_MICROCOPY_KEYS = [
  "onboarding.loading.microcopy1",
  "onboarding.loading.microcopy2",
  "onboarding.loading.microcopy3",
  "onboarding.loading.microcopy4",
] as const;

const LIST_LANGUAGES: { code: string; label: string }[] = [
  { code: "English", label: "🇬🇧 English" },
  { code: "Turkish", label: "🇹🇷 Turkish" },
  { code: "German", label: "🇩🇪 German" },
  { code: "French", label: "🇫🇷 French" },
  { code: "Spanish", label: "🇪🇸 Spanish" },
  { code: "Italian", label: "🇮🇹 Italian" },
  { code: "Portuguese", label: "🇵🇹 Portuguese" },
  { code: "Japanese", label: "🇯🇵 Japanese" },
  { code: "Chinese", label: "🇨🇳 Chinese" },
  { code: "Arabic", label: "🇸🇦 Arabic" },
];

const CATEGORY_TO_TOPIC_CATEGORY: Record<TopicCategory, string> = {
  travel: "travel",
  business: "business",
  technology: "technology",
  health: "health",
  academic: "academic",
  other: "travel",
};

function resolveInitialStep(stored: string | null): OnboardingStep {
  if (stored !== null && (RESUMABLE_STEPS as string[]).includes(stored)) {
    return stored as OnboardingStep;
  }
  return "welcome";
}

function selectBestList(
  lists: PredefinedList[],
  category: TopicCategory | null,
): PredefinedList | null {
  if (category && category !== "other") {
    const cat = CATEGORY_TO_TOPIC_CATEGORY[category];
    const match = lists.find((l) => l.topicCategory === cat);
    if (match) return match;
  }
  return lists[0] ?? null;
}

function getDefaultListLanguage(locale: string): string {
  return locale === "tr" ? "Turkish" : "English";
}

export default function OnboardingScreen() {
  const { i18n } = useLingui();
  const router = useRouter();

  const storedStep = useUserStore((s) => s.onboardingStep);
  const setOnboardingStep = useUserStore((s) => s.setOnboardingStep);
  const setHasCompletedOnboarding = useUserStore(
    (s) => s.setHasCompletedOnboarding,
  );
  const setProfile = useUserStore((s) => s.setProfile);
  const setOnboardingPersonalization = useUserStore(
    (s) => s.setOnboardingPersonalization,
  );
  const locale = useLanguageStore((s) => s.locale);
  const addList = useListsStore((s) => s.addList);
  const { incrementStat, checkAndUnlockAchievements } = useGameStore();

  const [step, setStep] = useState<OnboardingStep>(() =>
    resolveInitialStep(storedStep),
  );

  // Step 1 - name
  const [name, setName] = useState("");

  // Step 2 - purpose + notification pre-prompt
  const [purpose, setPurpose] = useState<LearningPurpose | null>(null);
  const [showNotifPrePrompt, setShowNotifPrePrompt] = useState(false);

  // Step 3 - topic
  const [topic, setTopic] = useState("");
  const [topicCategory, setTopicCategory] = useState<TopicCategory | null>(
    null,
  );
  const [wordCount, setWordCount] = useState<WordCount>(15);
  const [listLanguage, setListLanguage] = useState<string>(() =>
    getDefaultListLanguage(locale),
  );
  const [description, setDescription] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  // Rotating placeholder for topic input
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Step 4 - loading
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("A");
  const [loadingMicrocopyIndex, setLoadingMicrocopyIndex] = useState(0);
  const [showFunFact, setShowFunFact] = useState(false);
  const [previewList, setPreviewList] = useState<PredefinedList | null>(null);
  const hasCreatedList = useRef(false);

  // Persist step to store for resumable onboarding
  useEffect(() => {
    setOnboardingStep(step);
  }, [step, setOnboardingStep]);

  // Rotate placeholders every 3s when on topic step
  useEffect(() => {
    if (step !== "topic") return;
    const id = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % TOPIC_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [step]);

  // Loading Phase A animation
  useEffect(() => {
    if (step !== "loading" || loadingPhase !== "A") {
      if (step !== "loading") {
        setLoadingPhase("A");
        setLoadingMicrocopyIndex(0);
        setShowFunFact(false);
        hasCreatedList.current = false;
      }
      return;
    }

    const timerIds: number[] = [];

    // Rotate micro-copy every 2s
    for (let idx = 1; idx < LOADING_MICROCOPY_KEYS.length; idx++) {
      timerIds.push(
        setTimeout(() => {
          setLoadingMicrocopyIndex(idx);
        }, idx * 2000),
      );
    }

    // Fun fact card appears at 3s
    timerIds.push(
      setTimeout(() => {
        setShowFunFact(true);
      }, 3000),
    );

    // After all loading (~9s), create list and move to Phase B
    timerIds.push(
      setTimeout(
        () => {
          if (!hasCreatedList.current) {
            hasCreatedList.current = true;

            const allLists = getPredefinedListsByLocale(locale);
            const best = selectBestList(allLists, topicCategory);

            if (best) {
              const words: VocabWord[] = best.words.map((w) => ({
                ...w,
                status: "not_started" as const,
                timesCorrect: 0,
                timesWrong: 0,
              }));

              addList({
                id: `list-${Date.now()}`,
                name: topic.trim() || best.name,
                topic: topic.trim() || best.topic,
                topicCategory: topicCategory
                  ? CATEGORY_TO_TOPIC_CATEGORY[topicCategory]
                  : best.topicCategory,
                description: description.trim() || best.description,
                listLanguage,
                wordCount: words.length,
                source: "explore",
                sourceId: best.id,
                createdAt: new Date().toISOString(),
                words,
              });

              incrementStat("listsCreated");
              checkAndUnlockAchievements();
              setPreviewList({ ...best, name: topic.trim() || best.name });

              analyticsService.track("onboarding_generation_succeeded", {
                topic: topic.trim() || best.topic,
                wordCount: words.length,
              });
            }
          }

          setLoadingPhase("B");
        },
        LOADING_MICROCOPY_KEYS.length * 2000 + 1000,
      ),
    );

    return () => timerIds.forEach((id) => clearTimeout(id));
  }, [
    step,
    loadingPhase,
    topicCategory,
    topic,
    description,
    listLanguage,
    locale,
    addList,
    incrementStat,
    checkAndUnlockAchievements,
  ]);

  const goBack = () => {
    const prev: Partial<Record<OnboardingStep, OnboardingStep>> = {
      name: "welcome",
      purpose: "name",
      topic: "purpose",
    };
    const target = prev[step];
    if (target) setStep(target);
  };

  const handleWelcomeContinue = () => setStep("name");

  const handleNameContinue = () => {
    if (name.trim()) {
      setProfile({
        id: `user-${Date.now()}`,
        email: "",
        displayName: name.trim(),
        avatarUrl: null,
      });
    }
    analyticsService.track("onboarding_step_completed", {
      step: 1,
      stepName: "name",
    });
    setStep("purpose");
  };

  const handlePurposeSelect = (p: LearningPurpose) => {
    setPurpose(p);
    analyticsService.track("onboarding_step_completed", {
      step: 2,
      stepName: "purpose",
      purpose: p,
    });
    setShowNotifPrePrompt(true);
  };

  const handleNotifEnable = async () => {
    setShowNotifPrePrompt(false);
    const granted = await requestNotificationPermission();
    analyticsService.track("onboarding_notification_permission", { granted });
    setStep("topic");
  };

  const handleNotifDismiss = () => {
    setShowNotifPrePrompt(false);
    analyticsService.track("onboarding_notification_permission", {
      granted: false,
    });
    setStep("topic");
  };

  const handleBuildList = () => {
    setOnboardingPersonalization({
      topic: topic.trim(),
      category: topicCategory ?? "other",
      wordCount,
    });
    analyticsService.track("onboarding_topic_set", {
      topic: topic.trim(),
      topicCategory,
      wordCount,
      listLanguage,
      hasDescription: description.trim().length > 0,
    });
    analyticsService.track("onboarding_generation_started", {
      topic: topic.trim(),
      wordCount,
    });
    setStep("loading");
  };

  const handleStartTrial = () => {
    const displayName = name.trim() || "Learner";
    setProfile({
      id: `user-${Date.now()}`,
      email: "",
      displayName,
      avatarUrl: null,
      learningPurpose: purpose ?? undefined,
      dailyWordGoal: 10,
    });

    analyticsService.track("onboarding_paywall_shown", { plan: "annual" });
    analyticsService.track("onboarding_completed", {
      purpose,
      topic: topic.trim(),
      topicCategory,
      wordCount,
    });

    setOnboardingStep(null);
    setHasCompletedOnboarding(true);
    router.replace("/paywall");
  };

  const stepNum = STEP_NUMBER[step];
  const progress = stepNum ? stepNum / TOTAL_STEPS : 0;
  const showProgress = step !== "welcome";
  const showBack = step !== "welcome" && step !== "loading";

  const previewWords = previewList?.words.slice(0, 5) ?? [];
  const remainingCount = previewList
    ? Math.max(0, previewList.words.length - 5)
    : 0;

  const categoryLabel = topicCategory
    ? i18n._(
        `onboarding.topic.category.${topicCategory}` as Parameters<
          typeof i18n._
        >[0],
      )
    : "";

  return (
    <YStack flex={1} backgroundColor="$background">
      {showProgress && (
        <YStack paddingHorizontal="$5" paddingTop="$12" gap="$2">
          <XStack justifyContent="space-between" alignItems="center">
            {showBack ? (
              <SecondaryButton
                height={32}
                paddingHorizontal="$3"
                onPress={goBack}
                fontSize={14}
              >
                {i18n._("onboarding.back")}
              </SecondaryButton>
            ) : (
              <YStack width={80} />
            )}
            <Caption color="$colorSubtitle">
              {stepNum} / {TOTAL_STEPS}
            </Caption>
          </XStack>
          <YStack
            height={6}
            borderRadius={3}
            backgroundColor="$gray5"
            overflow="hidden"
          >
            <YStack
              height={6}
              borderRadius={3}
              backgroundColor="$blue10"
              width={`${Math.round(progress * 100)}%`}
            />
          </YStack>
        </YStack>
      )}

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack flex={1} padding="$5" paddingTop="$6">
          {/* Step 0: Welcome */}
          {step === "welcome" && (
            <YStack flex={1} justifyContent="space-between" paddingTop="$8">
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                gap="$6"
              >
                <Body fontSize={96} textAlign="center">
                  🎓
                </Body>
                <YStack gap="$3" alignItems="center">
                  <H2 textAlign="center">{i18n._("onboarding.heroTitle")}</H2>
                  <BodySmall color="$colorSubtitle" textAlign="center">
                    {i18n._("onboarding.heroSubtitle")}
                  </BodySmall>
                </YStack>
                <YStack gap="$2" width="100%">
                  <XStack gap="$3" alignItems="center">
                    <Caption fontSize={18}>🤖</Caption>
                    <BodySmall flex={1}>
                      {i18n._("onboarding.hero.feature1")}
                    </BodySmall>
                  </XStack>
                  <XStack gap="$3" alignItems="center">
                    <Caption fontSize={18}>📊</Caption>
                    <BodySmall flex={1}>
                      {i18n._("onboarding.hero.feature2")}
                    </BodySmall>
                  </XStack>
                  <XStack gap="$3" alignItems="center">
                    <Caption fontSize={18}>🔥</Caption>
                    <BodySmall flex={1}>
                      {i18n._("onboarding.hero.feature3")}
                    </BodySmall>
                  </XStack>
                </YStack>
              </YStack>
              <YStack paddingBottom="$4">
                <PrimaryButton onPress={handleWelcomeContinue}>
                  {i18n._("onboarding.letsGetStarted")}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {/* Step 1: Name */}
          {step === "name" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.name.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.heroSubtitle")}
                </BodySmall>
              </YStack>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={i18n._("onboarding.name.placeholder")}
                autoFocus
                style={{
                  fontSize: 18,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                }}
              />
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton onPress={handleNameContinue}>
                  {i18n._("onboarding.next")} →
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {/* Step 2: Purpose */}
          {step === "purpose" && !showNotifPrePrompt && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.purpose.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.purpose.subtitle")}
                </BodySmall>
              </YStack>
              <YStack gap="$3">
                {PURPOSE_OPTIONS.map(({ key, emoji, labelKey }) => (
                  <YStack
                    key={key}
                    borderRadius={16}
                    padding="$4"
                    borderWidth={2}
                    borderColor={purpose === key ? "$blue10" : "$borderColor"}
                    backgroundColor={purpose === key ? "$blue2" : "$gray2"}
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => handlePurposeSelect(key)}
                  >
                    <XStack gap="$3" alignItems="center">
                      <Body fontSize={28}>{emoji}</Body>
                      <Label flex={1}>{i18n._(labelKey)}</Label>
                      {purpose === key && (
                        <Caption color="$blue10" fontSize={18}>
                          ✓
                        </Caption>
                      )}
                    </XStack>
                  </YStack>
                ))}
              </YStack>
            </YStack>
          )}

          {/* Push notification pre-prompt overlay */}
          {step === "purpose" && showNotifPrePrompt && (
            <YStack flex={1} justifyContent="center" gap="$5">
              <YStack
                backgroundColor="$gray2"
                borderRadius={24}
                padding="$6"
                gap="$4"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <YStack gap="$3" alignItems="center">
                  <Body fontSize={48} textAlign="center">
                    🔔
                  </Body>
                  <H3 textAlign="center">
                    {i18n._("onboarding.notif.preTitle")}
                  </H3>
                  <BodySmall color="$colorSubtitle" textAlign="center">
                    {i18n._("onboarding.notif.preBody")}
                  </BodySmall>
                </YStack>
                <YStack gap="$3">
                  <PrimaryButton onPress={handleNotifEnable}>
                    {i18n._("onboarding.notif.enable")}
                  </PrimaryButton>
                  <SecondaryButton onPress={handleNotifDismiss}>
                    {i18n._("onboarding.notif.notNow")}
                  </SecondaryButton>
                </YStack>
              </YStack>
            </YStack>
          )}

          {/* Step 3: Topic / List Config */}
          {step === "topic" && (
            <YStack flex={1} gap="$4">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.topic.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.topic.subtitle")}
                </BodySmall>
              </YStack>

              {/* Topic text input */}
              <TextInput
                value={topic}
                onChangeText={setTopic}
                placeholder={TOPIC_PLACEHOLDERS[placeholderIndex]}
                style={{
                  fontSize: 16,
                  padding: 16,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: topic.length >= 2 ? "#3b82f6" : "#e2e8f0",
                  backgroundColor: "#f8fafc",
                  color: "#0f172a",
                }}
                maxLength={120}
              />

              {/* Category chips */}
              <YStack gap="$2">
                <Caption color="$colorSubtitle">
                  {i18n._("onboarding.topic.categoryLabel")}
                </Caption>
                <XStack flexWrap="wrap" gap="$2">
                  {CATEGORY_OPTIONS.map(({ key, labelKey }) => {
                    const isSelected = topicCategory === key;
                    return (
                      <YStack
                        key={key}
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        borderRadius={20}
                        borderWidth={2}
                        borderColor={isSelected ? "$blue10" : "$borderColor"}
                        backgroundColor={isSelected ? "$blue2" : "$gray2"}
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() =>
                          setTopicCategory(isSelected ? null : key)
                        }
                      >
                        <Caption
                          color={isSelected ? "$blue10" : "$colorSubtitle"}
                        >
                          {i18n._(labelKey)}
                        </Caption>
                      </YStack>
                    );
                  })}
                </XStack>
              </YStack>

              {/* Word count toggle */}
              <YStack gap="$2">
                <Caption color="$colorSubtitle">
                  {i18n._("onboarding.topic.wordCountLabel")}
                </Caption>
                <XStack gap="$2">
                  {WORD_COUNT_OPTIONS.map((wc) => {
                    const isSelected = wordCount === wc;
                    return (
                      <YStack
                        key={wc}
                        flex={1}
                        paddingVertical="$3"
                        borderRadius={12}
                        borderWidth={2}
                        borderColor={isSelected ? "$blue10" : "$borderColor"}
                        backgroundColor={isSelected ? "$blue2" : "$gray2"}
                        alignItems="center"
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => setWordCount(wc)}
                      >
                        <Label color={isSelected ? "$blue10" : "$gray11"}>
                          {wc}
                        </Label>
                      </YStack>
                    );
                  })}
                </XStack>
              </YStack>

              {/* List language */}
              <YStack gap="$2">
                <Caption color="$colorSubtitle">
                  {i18n._("onboarding.topic.languageLabel")}
                </Caption>
                <YStack
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius={12}
                  backgroundColor="$gray2"
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() => setShowLanguagePicker((v) => !v)}
                >
                  <XStack
                    padding="$3"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Body>
                      {LIST_LANGUAGES.find((l) => l.code === listLanguage)
                        ?.label ?? listLanguage}
                    </Body>
                    <Caption>{showLanguagePicker ? "▲" : "▼"}</Caption>
                  </XStack>
                  {showLanguagePicker && (
                    <YStack
                      borderTopWidth={1}
                      borderColor="$borderColor"
                      maxHeight={200}
                    >
                      <ScrollView nestedScrollEnabled>
                        {LIST_LANGUAGES.map((lang) => (
                          <YStack
                            key={lang.code}
                            padding="$3"
                            pressStyle={{ opacity: 0.7 }}
                            backgroundColor={
                              listLanguage === lang.code ? "$blue2" : undefined
                            }
                            onPress={() => {
                              setListLanguage(lang.code);
                              setShowLanguagePicker(false);
                            }}
                          >
                            <Body>{lang.label}</Body>
                          </YStack>
                        ))}
                      </ScrollView>
                    </YStack>
                  )}
                </YStack>
              </YStack>

              {/* Description accordion */}
              <YStack gap="$2">
                <YStack
                  pressStyle={{ opacity: 0.7 }}
                  onPress={() => setDescriptionExpanded((v) => !v)}
                >
                  <Caption color="$blue10">
                    {i18n._("onboarding.topic.descriptionToggle")}
                  </Caption>
                </YStack>
                {descriptionExpanded && (
                  <TextInput
                    value={description}
                    onChangeText={(t) => setDescription(t.slice(0, 500))}
                    placeholder={i18n._(
                      "onboarding.topic.descriptionPlaceholder",
                    )}
                    multiline
                    numberOfLines={3}
                    maxLength={500}
                    style={{
                      fontSize: 14,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                      backgroundColor: "#f8fafc",
                      color: "#0f172a",
                      minHeight: 80,
                      textAlignVertical: "top",
                    }}
                  />
                )}
              </YStack>

              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton
                  onPress={handleBuildList}
                  disabled={topic.trim().length < 2}
                >
                  {i18n._("onboarding.topic.buildCta")}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {/* Step 4: Loading - Phase A (generating animation) */}
          {step === "loading" && loadingPhase === "A" && (
            <YStack
              flex={1}
              alignItems="center"
              justifyContent="center"
              gap="$6"
            >
              <Body fontSize={80} textAlign="center">
                🔮
              </Body>
              <YStack gap="$3" alignItems="center" width="100%">
                <H3 textAlign="center">
                  {i18n._("onboarding.loading.generatingTitle")}
                </H3>
                <YStack
                  height={6}
                  borderRadius={3}
                  backgroundColor="$gray5"
                  overflow="hidden"
                  width="100%"
                >
                  <YStack
                    height={6}
                    borderRadius={3}
                    backgroundColor="$blue10"
                    width={`${Math.round(
                      ((loadingMicrocopyIndex + 1) /
                        LOADING_MICROCOPY_KEYS.length) *
                        100,
                    )}%`}
                  />
                </YStack>
                <Body color="$colorSubtitle" textAlign="center">
                  {i18n._(LOADING_MICROCOPY_KEYS[loadingMicrocopyIndex])}
                </Body>
              </YStack>
              {showFunFact && (
                <Card
                  backgroundColor="$blue2"
                  borderColor="$blue8"
                  borderWidth={1}
                >
                  <BodySmall color="$colorSubtitle" textAlign="center">
                    {i18n._("onboarding.loading.funFact")}
                  </BodySmall>
                </Card>
              )}
            </YStack>
          )}

          {/* Step 4: Loading - Phase B (list preview) */}
          {step === "loading" && loadingPhase === "B" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$3" alignItems="center">
                <Body fontSize={64} textAlign="center">
                  ✨
                </Body>
                <H2 textAlign="center">{i18n._("onboarding.preview.title")}</H2>
                <YStack alignItems="center" gap="$1">
                  <H3 textAlign="center">
                    {(topic.trim() || previewList?.name) ?? ""}
                  </H3>
                  <BodySmall color="$colorSubtitle" textAlign="center">
                    {i18n
                      ._("onboarding.preview.meta")
                      .replace(
                        "{wordCount}",
                        String(previewList?.words.length ?? wordCount),
                      )
                      .replace("{category}", categoryLabel)}
                  </BodySmall>
                </YStack>
              </YStack>

              {/* First 5 words preview */}
              {previewWords.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$3" paddingHorizontal="$1">
                    {previewWords.map((word) => (
                      <Card
                        key={word.id}
                        width={140}
                        alignItems="center"
                        gap="$1"
                      >
                        <Label textAlign="center" numberOfLines={2}>
                          {word.term}
                        </Label>
                        <Caption
                          color="$colorSubtitle"
                          textAlign="center"
                          numberOfLines={2}
                        >
                          {word.translation}
                        </Caption>
                      </Card>
                    ))}
                  </XStack>
                </ScrollView>
              )}

              {/* Blurred remaining words */}
              {remainingCount > 0 && (
                <Card
                  backgroundColor="$gray3"
                  borderColor="$borderColor"
                  borderWidth={1}
                  alignItems="center"
                  gap="$2"
                  opacity={0.85}
                >
                  <XStack gap="$2" alignItems="center">
                    <Body fontSize={22}>🔒</Body>
                    <YStack gap="$1">
                      <Label>
                        {i18n
                          ._("onboarding.preview.locked")
                          .replace("{count}", String(remainingCount))}
                      </Label>
                      <Caption color="$colorSubtitle">
                        {i18n._("onboarding.preview.lockedCta")}
                      </Caption>
                    </YStack>
                  </XStack>
                </Card>
              )}

              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton onPress={handleStartTrial}>
                  {i18n._("onboarding.preview.trialCta")}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
