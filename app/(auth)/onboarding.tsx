import { useLingui } from "@lingui/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TextInput } from "react-native";
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
  getPredefinedListsByLocale,
  LIST_CATEGORIES,
  type ListCategory,
  type PredefinedList,
} from "@/constants/predefined-lists";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useGameStore } from "@/store/gameStore";
import { useLanguageStore } from "@/store/languageStore";
import { useListsStore, type VocabWord } from "@/store/listsStore";
import { useUserStore } from "@/store/userStore";

type OnboardingStep = "welcome" | "language" | "firstList" | "allSet";

export default function OnboardingScreen() {
  const { i18n } = useLingui();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ListCategory>("all");
  const [selectedList, setSelectedList] = useState<PredefinedList | null>(null);

  const setHasCompletedOnboarding = useUserStore(
    (state) => state.setHasCompletedOnboarding,
  );
  const setProfile = useUserStore((state) => state.setProfile);
  const locale = useLanguageStore((state) => state.locale);
  const setLocale = useLanguageStore((state) => state.setLocale);
  const addList = useListsStore((state) => state.addList);
  const { incrementStat, checkAndUnlockAchievements } = useGameStore();
  const router = useRouter();

  const predefinedLists = getPredefinedListsByLocale(locale);

  const nonAllCategories = LIST_CATEGORIES.map((c) => ({
    key: c.key,
    label: i18n._(c.labelKey),
  }));

  const filteredLists =
    selectedCategory === "all"
      ? predefinedLists.slice(0, 6)
      : predefinedLists
          .filter((l) => l.topicCategory === selectedCategory)
          .slice(0, 6);

  const stepIndex: Record<OnboardingStep, number> = {
    welcome: 0,
    language: 1,
    firstList: 2,
    allSet: 3,
  };

  const handleWelcomeNext = () => {
    if (name.trim()) {
      setProfile({
        id: `user-${Date.now()}`,
        email: "",
        displayName: name.trim(),
        avatarUrl: null,
      });
    }
    setStep("language");
  };

  const handleLanguageSelect = (lang: "en" | "tr") => {
    setLocale(lang);
    setStep("firstList");
  };

  const handleAddList = () => {
    if (selectedList) {
      const words: VocabWord[] = selectedList.words.map((w) => ({
        ...w,
        status: "not_started" as const,
        timesCorrect: 0,
        timesWrong: 0,
      }));
      addList({
        id: `list-${Date.now()}`,
        name: selectedList.name,
        topic: selectedList.topic,
        topicCategory: selectedList.topicCategory,
        description: selectedList.description,
        listLanguage: selectedList.listLanguage,
        wordCount: words.length,
        source: "explore",
        sourceId: selectedList.id,
        createdAt: new Date().toISOString(),
        words,
      });
      incrementStat("listsCreated");
      checkAndUnlockAchievements();
      analyticsService.track("onboarding_list_added", {
        listId: selectedList.id,
      });
    }
    setStep("allSet");
  };

  const handleFinish = () => {
    analyticsService.track("onboarding_completed");
    setHasCompletedOnboarding(true);
    router.replace("/(tabs)");
  };

  const currentStepIndex = stepIndex[step];

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$6"
      justifyContent="space-between"
    >
      {/* Step indicator */}
      <XStack gap="$2" justifyContent="center" paddingTop="$4">
        {(["welcome", "language", "firstList", "allSet"] as const).map(
          (stepName) => (
            <YStack
              key={stepName}
              width={stepName === step ? 24 : 8}
              height={8}
              borderRadius={4}
              backgroundColor={
                stepIndex[stepName] <= currentStepIndex ? "$blue10" : "$gray6"
              }
            />
          ),
        )}
      </XStack>

      {/* Step content */}
      <YStack flex={1} justifyContent="center" gap="$4">
        {step === "welcome" && (
          <YStack gap="$5">
            <YStack gap="$3" alignItems="center">
              <Body fontSize={64}>🎓</Body>
              <H2 textAlign="center">{i18n._("onboarding.welcome")}</H2>
              <BodySmall color="$colorSubtitle" textAlign="center">
                {i18n._("onboarding.welcomeSubtitle")}
              </BodySmall>
            </YStack>
            <YStack gap="$2">
              <Label>{i18n._("onboarding.yourName")}</Label>
              <YStack
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius={12}
                padding="$3"
                backgroundColor="$gray2"
              >
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={i18n._("onboarding.namePlaceholder")}
                  style={{ fontSize: 16 }}
                />
              </YStack>
            </YStack>
          </YStack>
        )}

        {step === "language" && (
          <YStack gap="$5" alignItems="center">
            <Body fontSize={48}>🌍</Body>
            <H2 textAlign="center">{i18n._("onboarding.chooseLanguage")}</H2>
            <YStack width="100%" gap="$3">
              <Card
                pressStyle={{ opacity: 0.8, borderColor: "$blue10" }}
                onPress={() => handleLanguageSelect("en")}
                borderWidth={2}
                borderColor={locale === "en" ? "$blue10" : "$borderColor"}
              >
                <XStack alignItems="center" gap="$3">
                  <Body fontSize={32}>🇬🇧</Body>
                  <YStack>
                    <H3>{i18n._("onboarding.english")}</H3>
                    <Caption color="$colorSubtitle">
                      {i18n._("onboarding.englishDesc")}
                    </Caption>
                  </YStack>
                </XStack>
              </Card>
              <Card
                pressStyle={{ opacity: 0.8, borderColor: "$blue10" }}
                onPress={() => handleLanguageSelect("tr")}
                borderWidth={2}
                borderColor={locale === "tr" ? "$blue10" : "$borderColor"}
              >
                <XStack alignItems="center" gap="$3">
                  <Body fontSize={32}>🇹🇷</Body>
                  <YStack>
                    <H3>{i18n._("onboarding.turkish")}</H3>
                    <Caption color="$colorSubtitle">
                      {i18n._("onboarding.turkishDesc")}
                    </Caption>
                  </YStack>
                </XStack>
              </Card>
            </YStack>
          </YStack>
        )}

        {step === "firstList" && (
          <YStack gap="$3">
            <YStack gap="$1">
              <H2>{i18n._("onboarding.firstList")}</H2>
              <BodySmall color="$colorSubtitle">
                {i18n._("onboarding.firstListSubtitle")}
              </BodySmall>
            </YStack>
            <CategoryChips
              categories={nonAllCategories}
              selected={selectedCategory}
              onSelect={(val) => {
                setSelectedCategory(val as ListCategory);
                setSelectedList(null);
              }}
            />
            <YStack gap="$2" maxHeight={320}>
              {filteredLists.map((list) => (
                <Card
                  key={list.id}
                  pressStyle={{ opacity: 0.8 }}
                  onPress={() =>
                    setSelectedList(selectedList?.id === list.id ? null : list)
                  }
                  borderWidth={2}
                  borderColor={
                    selectedList?.id === list.id ? "$blue10" : "$borderColor"
                  }
                  backgroundColor={
                    selectedList?.id === list.id ? "$blue2" : "$background"
                  }
                >
                  <XStack justifyContent="space-between" alignItems="center">
                    <YStack flex={1}>
                      <Label numberOfLines={1}>{list.name}</Label>
                      <Caption color="$colorSubtitle">
                        {list.words.length} {i18n._("createList.wordCount")}
                      </Caption>
                    </YStack>
                    {selectedList?.id === list.id && (
                      <Caption color="$blue10">✓</Caption>
                    )}
                  </XStack>
                </Card>
              ))}
            </YStack>
          </YStack>
        )}

        {step === "allSet" && (
          <YStack gap="$4" alignItems="center">
            <Body fontSize={72}>🚀</Body>
            <H2 textAlign="center">{i18n._("onboarding.allSet")}</H2>
            <BodySmall color="$colorSubtitle" textAlign="center">
              {selectedList
                ? i18n._("onboarding.allSetWithList")
                : i18n._("onboarding.allSetSubtitle")}
            </BodySmall>
          </YStack>
        )}
      </YStack>

      {/* Bottom actions */}
      <YStack gap="$3" paddingBottom="$4">
        {step === "welcome" && (
          <PrimaryButton onPress={handleWelcomeNext}>
            {i18n._("onboarding.next")} →
          </PrimaryButton>
        )}
        {step === "language" && (
          <SecondaryButton onPress={() => setStep("firstList")}>
            {i18n._("onboarding.skip")}
          </SecondaryButton>
        )}
        {step === "firstList" && (
          <>
            <PrimaryButton onPress={handleAddList} disabled={!selectedList}>
              {selectedList
                ? i18n._("onboarding.addListAndStart")
                : i18n._("onboarding.selectListFirst")}
            </PrimaryButton>
            <SecondaryButton onPress={() => setStep("allSet")}>
              {i18n._("onboarding.skipList")}
            </SecondaryButton>
          </>
        )}
        {step === "allSet" && (
          <PrimaryButton onPress={handleFinish}>
            {i18n._("onboarding.getStarted")} 🎉
          </PrimaryButton>
        )}
      </YStack>
    </YStack>
  );
}
