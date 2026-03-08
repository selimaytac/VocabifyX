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
import { getPredefinedListsByLocale } from "@/constants/predefined-lists";
import type { PredefinedList } from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useGameStore } from "@/store/gameStore";
import { useLanguageStore } from "@/store/languageStore";
import { useListsStore } from "@/store/listsStore";
import type { VocabWord } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

// React Native exposes timer functions globally but the "esnext" tsconfig lib
// does not include them. Declare minimal types here to avoid ts-expect-error.
declare function setTimeout(callback: () => void, ms?: number): number;
declare function clearTimeout(id: number): void;

type OnboardingStep =
  | "welcome"
  | "name"
  | "purpose"
  | "level"
  | "dailyGoal"
  | "topics"
  | "loading"
  | "plan";

type LearningPurpose = "work" | "travel" | "education" | "personal";
type ProficiencyLevel = "beginner" | "elementary" | "intermediate" | "advanced";
type TopicKey = "travel" | "business" | "technology" | "daily_life" | "academic";

const TOTAL_STEPS = 7;

const STEP_NUMBER: Partial<Record<OnboardingStep, number>> = {
  name: 1,
  purpose: 2,
  level: 3,
  dailyGoal: 4,
  topics: 5,
  loading: 6,
  plan: 7,
};

const RESUMABLE_STEPS: OnboardingStep[] = [
  "name",
  "purpose",
  "level",
  "dailyGoal",
  "topics",
  "loading",
  "plan",
];

const TOPIC_CATEGORY_MAP: Record<TopicKey, string> = {
  travel: "travel",
  business: "business",
  technology: "technology",
  daily_life: "daily_life",
  academic: "academic",
};

const TOPIC_EMOJI: Record<TopicKey, string> = {
  travel: "✈️",
  business: "💼",
  technology: "💻",
  daily_life: "🏠",
  academic: "🎓",
};

const TOPIC_LABEL_KEY: Record<TopicKey, string> = {
  travel: "onboarding.topics.travel",
  business: "onboarding.topics.business",
  technology: "onboarding.topics.technology",
  daily_life: "onboarding.topics.dailyLife",
  academic: "onboarding.topics.academic",
};

const LEVEL_EMOJI: Record<ProficiencyLevel, string> = {
  beginner: "🌱",
  elementary: "📖",
  intermediate: "🎯",
  advanced: "🚀",
};

const LOADING_STEPS: { key: string; emoji: string }[] = [
  { key: "onboarding.loading.analyzing", emoji: "🧠" },
  { key: "onboarding.loading.matching", emoji: "📚" },
  { key: "onboarding.loading.building", emoji: "📋" },
  { key: "onboarding.loading.almostReady", emoji: "✨" },
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

const LEVEL_OPTIONS: {
  key: ProficiencyLevel;
  labelKey: string;
  descKey: string;
}[] = [
  {
    key: "beginner",
    labelKey: "onboarding.level.beginner",
    descKey: "onboarding.level.beginnerDesc",
  },
  {
    key: "elementary",
    labelKey: "onboarding.level.elementary",
    descKey: "onboarding.level.elementaryDesc",
  },
  {
    key: "intermediate",
    labelKey: "onboarding.level.intermediate",
    descKey: "onboarding.level.intermediateDesc",
  },
  {
    key: "advanced",
    labelKey: "onboarding.level.advanced",
    descKey: "onboarding.level.advancedDesc",
  },
];

const DAILY_GOAL_OPTIONS: {
  value: number;
  emoji: string;
  labelKey: string;
  descKey: string;
}[] = [
  {
    value: 5,
    emoji: "🐣",
    labelKey: "onboarding.dailyGoal.5",
    descKey: "onboarding.dailyGoal.5desc",
  },
  {
    value: 10,
    emoji: "📘",
    labelKey: "onboarding.dailyGoal.10",
    descKey: "onboarding.dailyGoal.10desc",
  },
  {
    value: 20,
    emoji: "🔥",
    labelKey: "onboarding.dailyGoal.20",
    descKey: "onboarding.dailyGoal.20desc",
  },
  {
    value: 30,
    emoji: "⚡",
    labelKey: "onboarding.dailyGoal.30",
    descKey: "onboarding.dailyGoal.30desc",
  },
];

const TOPIC_OPTIONS: {
  key: TopicKey;
  emoji: string;
  labelKey: string;
}[] = [
  { key: "travel", emoji: "✈️", labelKey: "onboarding.topics.travel" },
  { key: "business", emoji: "💼", labelKey: "onboarding.topics.business" },
  { key: "technology", emoji: "💻", labelKey: "onboarding.topics.technology" },
  { key: "daily_life", emoji: "🏠", labelKey: "onboarding.topics.dailyLife" },
  { key: "academic", emoji: "🎓", labelKey: "onboarding.topics.academic" },
];

function resolveInitialStep(stored: string | null): OnboardingStep {
  if (stored !== null && (RESUMABLE_STEPS as string[]).includes(stored)) {
    return stored as OnboardingStep;
  }
  return "welcome";
}

function selectBestList(
  lists: PredefinedList[],
  topics: TopicKey[],
): PredefinedList | null {
  for (const topic of topics) {
    const cat = TOPIC_CATEGORY_MAP[topic];
    const match = lists.find((l) => l.topicCategory === cat);
    if (match) return match;
  }
  return lists[0] ?? null;
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
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const addList = useListsStore((s) => s.addList);
  const { incrementStat, checkAndUnlockAchievements } = useGameStore();

  const [step, setStep] = useState<OnboardingStep>(() =>
    resolveInitialStep(storedStep),
  );
  const [name, setName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "tr">(locale);
  const [purpose, setPurpose] = useState<LearningPurpose | null>(null);
  const [level, setLevel] = useState<ProficiencyLevel | null>(null);
  const [dailyGoal, setDailyGoal] = useState<number | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<TopicKey[]>([]);
  const [completedLoadingSteps, setCompletedLoadingSteps] = useState(0);
  const [createdListName, setCreatedListName] = useState<string | null>(null);
  const [estimatedDays, setEstimatedDays] = useState(30);

  const hasCreatedList = useRef(false);

  useEffect(() => {
    setOnboardingStep(step);
  }, [step, setOnboardingStep]);

  useEffect(() => {
    if (step !== "loading") {
      setCompletedLoadingSteps(0);
      hasCreatedList.current = false;
      return;
    }

    // Collect timer IDs using the React Native-compatible number type
    const timerIds: number[] = [];

    LOADING_STEPS.forEach((_, idx) => {
      timerIds.push(
        setTimeout(() => {
          setCompletedLoadingSteps(idx + 1);
        }, (idx + 1) * 700),
      );
    });

    timerIds.push(
      setTimeout(() => {
        if (!hasCreatedList.current) {
          hasCreatedList.current = true;

          const topicsToUse: TopicKey[] =
            selectedTopics.length > 0
              ? selectedTopics
              : ["travel", "daily_life", "business"];

          const allLists = getPredefinedListsByLocale(selectedLanguage);
          const best = selectBestList(allLists, topicsToUse);

          if (best) {
            const words: VocabWord[] = best.words.map((w) => ({
              ...w,
              status: "not_started" as const,
              timesCorrect: 0,
              timesWrong: 0,
            }));

            addList({
              id: `list-${Date.now()}`,
              name: best.name,
              topic: best.topic,
              topicCategory: best.topicCategory,
              description: best.description,
              listLanguage: best.listLanguage,
              wordCount: words.length,
              source: "explore",
              sourceId: best.id,
              createdAt: new Date().toISOString(),
              words,
            });

            incrementStat("listsCreated");
            checkAndUnlockAchievements();
            setCreatedListName(best.name);

            const goal = dailyGoal ?? 10;
            setEstimatedDays(Math.max(1, Math.ceil(words.length / goal)));

            analyticsService.track("onboarding_list_created", {
              listId: best.id,
              topics: topicsToUse,
            });
          }
        }

        setStep("plan");
      }, LOADING_STEPS.length * 700 + 600),
    );

    return () => timerIds.forEach((id) => clearTimeout(id));
  }, [
    step,
    selectedTopics,
    selectedLanguage,
    dailyGoal,
    addList,
    incrementStat,
    checkAndUnlockAchievements,
  ]);

  const goBack = () => {
    const prev: Partial<Record<OnboardingStep, OnboardingStep>> = {
      name: "welcome",
      purpose: "name",
      level: "purpose",
      dailyGoal: "level",
      topics: "dailyGoal",
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
    setLocale(selectedLanguage);
    setStep("purpose");
  };

  const toggleTopic = (topic: TopicKey) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) return prev.filter((t) => t !== topic);
      if (prev.length >= 3) return [...prev.slice(1), topic];
      return [...prev, topic];
    });
  };

  const handleTopicsContinue = () => {
    analyticsService.track("onboarding_topics_selected", {
      topics: selectedTopics,
    });
    setStep("loading");
  };

  const handlePlanCommit = () => {
    const displayName = name.trim() || "Learner";
    setProfile({
      id: `user-${Date.now()}`,
      email: "",
      displayName,
      avatarUrl: null,
      learningPurpose: purpose ?? undefined,
      proficiencyLevel: level ?? undefined,
      dailyWordGoal: dailyGoal ?? 10,
      interestedTopics: selectedTopics,
    });

    analyticsService.track("onboarding_completed", {
      purpose,
      level,
      dailyGoal,
      topics: selectedTopics,
    });

    setOnboardingStep(null);
    setHasCompletedOnboarding(true);
    router.replace("/paywall");
  };

  const stepNum = STEP_NUMBER[step];
  const progress = stepNum ? stepNum / TOTAL_STEPS : 0;
  const showProgress = step !== "welcome";
  const showBack =
    step !== "welcome" && step !== "loading" && step !== "plan";

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

          {step === "welcome" && (
            <YStack flex={1} justifyContent="space-between" paddingTop="$8">
              <YStack
                flex={1}
                alignItems="center"
                justifyContent="center"
                gap="$6"
              >
                <Body fontSize={96} textAlign="center">🎓</Body>
                <YStack gap="$3" alignItems="center">
                  <H2 textAlign="center">{i18n._("onboarding.heroTitle")}</H2>
                  <BodySmall color="$colorSubtitle" textAlign="center">
                    {i18n._("onboarding.heroSubtitle")}
                  </BodySmall>
                </YStack>
                <YStack gap="$2" width="100%">
                  {[
                    "🤖  AI-powered vocabulary personalization",
                    "📊  Smart progress tracking",
                    "🔥  Daily streaks & achievements",
                  ].map((item) => (
                    <XStack
                      key={item}
                      alignItems="center"
                      backgroundColor="$gray3"
                      paddingHorizontal="$4"
                      paddingVertical="$3"
                      borderRadius={12}
                    >
                      <BodySmall>{item}</BodySmall>
                    </XStack>
                  ))}
                </YStack>
              </YStack>
              <YStack paddingBottom="$4">
                <PrimaryButton onPress={handleWelcomeContinue}>
                  {i18n._("onboarding.letsGetStarted")}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "name" && (
            <YStack flex={1} gap="$6">
              <YStack gap="$3">
                <H2>{i18n._("onboarding.name.title")}</H2>
                <YStack
                  borderWidth={1}
                  borderColor="$borderColor"
                  borderRadius={12}
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  backgroundColor="$gray2"
                >
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={i18n._("onboarding.name.placeholder")}
                    style={{ fontSize: 16 }}
                    autoFocus
                    returnKeyType="done"
                  />
                </YStack>
              </YStack>

              <YStack gap="$3">
                <H2>{i18n._("onboarding.name.languageTitle")}</H2>
                <YStack gap="$3">
                  {(["en", "tr"] as const).map((lang) => {
                    const isSelected = selectedLanguage === lang;
                    return (
                      <Card
                        key={lang}
                        pressStyle={{ opacity: 0.8 }}
                        onPress={() => setSelectedLanguage(lang)}
                        borderWidth={2}
                        borderColor={isSelected ? "$blue10" : "$borderColor"}
                        backgroundColor={isSelected ? "$blue2" : "$background"}
                      >
                        <XStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <YStack>
                            <Label>
                              {i18n._(
                                lang === "en"
                                  ? "onboarding.name.english"
                                  : "onboarding.name.turkish",
                              )}
                            </Label>
                            <Caption color="$colorSubtitle">
                              {i18n._(
                                lang === "en"
                                  ? "onboarding.name.englishDesc"
                                  : "onboarding.name.turkishDesc",
                              )}
                            </Caption>
                          </YStack>
                          {isSelected && (
                            <Body color="$blue10" fontSize={18}>
                              ✓
                            </Body>
                          )}
                        </XStack>
                      </Card>
                    );
                  })}
                </YStack>
              </YStack>

              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton onPress={handleNameContinue}>
                  {i18n._("onboarding.next")} →
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "purpose" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.purpose.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.purpose.subtitle")}
                </BodySmall>
              </YStack>
              <YStack gap="$3">
                {PURPOSE_OPTIONS.map(({ key, emoji, labelKey }) => {
                  const isSelected = purpose === key;
                  return (
                    <Card
                      key={key}
                      pressStyle={{ opacity: 0.8 }}
                      onPress={() => setPurpose(key)}
                      borderWidth={2}
                      borderColor={isSelected ? "$blue10" : "$borderColor"}
                      backgroundColor={isSelected ? "$blue2" : "$background"}
                    >
                      <XStack gap="$4" alignItems="center">
                        <Body fontSize={32}>{emoji}</Body>
                        <Label flex={1}>{i18n._(labelKey)}</Label>
                        {isSelected && (
                          <Body color="$blue10" fontSize={18}>
                            ✓
                          </Body>
                        )}
                      </XStack>
                    </Card>
                  );
                })}
              </YStack>
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton
                  onPress={() => setStep("level")}
                  disabled={!purpose}
                >
                  {i18n._("onboarding.next")} →
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "level" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.level.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.level.subtitle")}
                </BodySmall>
              </YStack>
              <YStack gap="$3">
                {LEVEL_OPTIONS.map(({ key, labelKey, descKey }) => {
                  const isSelected = level === key;
                  return (
                    <Card
                      key={key}
                      pressStyle={{ opacity: 0.8 }}
                      onPress={() => setLevel(key)}
                      borderWidth={2}
                      borderColor={isSelected ? "$blue10" : "$borderColor"}
                      backgroundColor={isSelected ? "$blue2" : "$background"}
                    >
                      <XStack gap="$4" alignItems="center">
                        <Body fontSize={32}>{LEVEL_EMOJI[key]}</Body>
                        <YStack flex={1}>
                          <Label>{i18n._(labelKey)}</Label>
                          <Caption color="$colorSubtitle">
                            {i18n._(descKey)}
                          </Caption>
                        </YStack>
                        {isSelected && (
                          <Body color="$blue10" fontSize={18}>
                            ✓
                          </Body>
                        )}
                      </XStack>
                    </Card>
                  );
                })}
              </YStack>
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton
                  onPress={() => setStep("dailyGoal")}
                  disabled={!level}
                >
                  {i18n._("onboarding.next")} →
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "dailyGoal" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.dailyGoal.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.dailyGoal.subtitle")}
                </BodySmall>
              </YStack>
              <YStack gap="$3">
                {DAILY_GOAL_OPTIONS.map(({ value, emoji, labelKey, descKey }) => {
                  const isSelected = dailyGoal === value;
                  return (
                    <Card
                      key={value}
                      pressStyle={{ opacity: 0.8 }}
                      onPress={() => setDailyGoal(value)}
                      borderWidth={2}
                      borderColor={isSelected ? "$blue10" : "$borderColor"}
                      backgroundColor={isSelected ? "$blue2" : "$background"}
                    >
                      <XStack gap="$4" alignItems="center">
                        <Body fontSize={32}>{emoji}</Body>
                        <YStack flex={1}>
                          <Label>{i18n._(labelKey)}</Label>
                          <Caption color="$colorSubtitle">
                            {i18n._(descKey)}
                          </Caption>
                        </YStack>
                        {isSelected && (
                          <Body color="$blue10" fontSize={18}>
                            ✓
                          </Body>
                        )}
                      </XStack>
                    </Card>
                  );
                })}
              </YStack>
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton
                  onPress={() => setStep("topics")}
                  disabled={dailyGoal === null}
                >
                  {i18n._("onboarding.next")} →
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "topics" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$2">
                <H2>{i18n._("onboarding.topics.title")}</H2>
                <BodySmall color="$colorSubtitle">
                  {i18n._("onboarding.topics.subtitle")}
                </BodySmall>
              </YStack>
              <XStack flexWrap="wrap" gap="$3" justifyContent="space-between">
                {TOPIC_OPTIONS.map(({ key, emoji, labelKey }) => {
                  const isSelected = selectedTopics.includes(key);
                  return (
                    <YStack
                      key={key}
                      width="48%"
                      borderRadius={16}
                      padding="$4"
                      alignItems="center"
                      gap="$2"
                      borderWidth={2}
                      borderColor={isSelected ? "$blue10" : "$borderColor"}
                      backgroundColor={isSelected ? "$blue2" : "$gray2"}
                      pressStyle={{ opacity: 0.8 }}
                      onPress={() => toggleTopic(key)}
                      marginBottom="$2"
                    >
                      <Body fontSize={40}>{emoji}</Body>
                      <Label textAlign="center">{i18n._(labelKey)}</Label>
                      {isSelected && (
                        <Caption color="$blue10" fontSize={16}>
                          ✓
                        </Caption>
                      )}
                    </YStack>
                  );
                })}
              </XStack>
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton
                  onPress={handleTopicsContinue}
                  disabled={selectedTopics.length === 0}
                >
                  {i18n
                    ._("onboarding.topics.startWith")
                    .replace("{n}", String(selectedTopics.length))}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

          {step === "loading" && (
            <YStack
              flex={1}
              alignItems="center"
              justifyContent="center"
              gap="$8"
            >
              <Body fontSize={80} textAlign="center">
                🔮
              </Body>
              <YStack gap="$2" width="100%">
                <Caption color="$colorSubtitle" textAlign="center">
                  {i18n._("onboarding.loading.title")}
                </Caption>
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
                    width={`${Math.round(
                      (completedLoadingSteps / LOADING_STEPS.length) * 100,
                    )}%`}
                  />
                </YStack>
              </YStack>
              <YStack width="100%" gap="$5">
                {LOADING_STEPS.map(({ key, emoji }, idx) => {
                  const done = idx < completedLoadingSteps;
                  const active = idx === completedLoadingSteps;
                  return (
                    <XStack
                      key={key}
                      gap="$4"
                      alignItems="center"
                      opacity={done || active ? 1 : 0.3}
                    >
                      <Body fontSize={24}>{emoji}</Body>
                      <Body
                        flex={1}
                        color={done ? "$gray12" : "$colorSubtitle"}
                        fontWeight={done ? "600" : "400"}
                      >
                        {i18n._(key)}
                      </Body>
                      {done && (
                        <Body color="$green10" fontSize={18}>
                          ✓
                        </Body>
                      )}
                    </XStack>
                  );
                })}
              </YStack>
            </YStack>
          )}

          {step === "plan" && (
            <YStack flex={1} gap="$5">
              <YStack gap="$3" alignItems="center">
                <Body fontSize={72} textAlign="center">
                  🎯
                </Body>
                <H2 textAlign="center">{i18n._("onboarding.plan.title")}</H2>
                <BodySmall color="$colorSubtitle" textAlign="center">
                  {i18n._("onboarding.plan.subtitle")}
                </BodySmall>
              </YStack>
              <YStack gap="$3">
                <Card
                  backgroundColor="$blue2"
                  borderColor="$blue8"
                  borderWidth={2}
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack gap="$1">
                      <Caption color="$colorSubtitle">
                        {i18n._("onboarding.plan.dailyGoalLabel")}
                      </Caption>
                      <H3>{dailyGoal ?? 10} words / day</H3>
                    </YStack>
                    <Body fontSize={32}>📅</Body>
                  </XStack>
                </Card>

                {level && (
                  <Card>
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack gap="$1">
                        <Caption color="$colorSubtitle">
                          {i18n._("onboarding.plan.levelLabel")}
                        </Caption>
                        <H3 textTransform="capitalize">{level}</H3>
                      </YStack>
                      <Body fontSize={32}>{LEVEL_EMOJI[level]}</Body>
                    </XStack>
                  </Card>
                )}

                {selectedTopics.length > 0 && (
                  <Card>
                    <YStack gap="$2">
                      <Caption color="$colorSubtitle">
                        {i18n._("onboarding.plan.topicsLabel")}
                      </Caption>
                      <XStack gap="$2" flexWrap="wrap">
                        {selectedTopics.map((t) => (
                          <XStack
                            key={t}
                            backgroundColor="$gray4"
                            paddingHorizontal="$3"
                            paddingVertical="$1"
                            borderRadius={20}
                            gap="$1"
                            alignItems="center"
                          >
                            <Caption>{TOPIC_EMOJI[t]}</Caption>
                            <Caption>{i18n._(TOPIC_LABEL_KEY[t])}</Caption>
                          </XStack>
                        ))}
                      </XStack>
                    </YStack>
                  </Card>
                )}

                {createdListName && (
                  <Card
                    backgroundColor="$green2"
                    borderColor="$green8"
                    borderWidth={2}
                  >
                    <YStack gap="$1">
                      <Caption color="$colorSubtitle">
                        {i18n._("onboarding.plan.firstListLabel")}
                      </Caption>
                      <Label>{createdListName}</Label>
                      <Caption color="$colorSubtitle">
                        {i18n
                          ._("onboarding.plan.estimatedDays")
                          .replace("{days}", String(estimatedDays))}
                      </Caption>
                    </YStack>
                  </Card>
                )}
              </YStack>
              <YStack flex={1} justifyContent="flex-end" paddingBottom="$4">
                <PrimaryButton onPress={handlePlanCommit}>
                  {i18n._("onboarding.plan.commit")}
                </PrimaryButton>
              </YStack>
            </YStack>
          )}

        </YStack>
      </ScrollView>
    </YStack>
  );
}
