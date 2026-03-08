import { useLingui } from "@lingui/react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, StyleSheet } from "react-native";
import { XStack, YStack } from "tamagui";

import { SecondaryButton } from "@/components/DesignSystem/Button";
import { ProgressBar } from "@/components/DesignSystem/ProgressBar";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  H3,
  Label,
} from "@/components/DesignSystem/Typography";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useGameStore } from "@/store/gameStore";
import { useListsStore } from "@/store/listsStore";
import { useSessionsStore } from "@/store/sessionsStore";

const XP_PER_CORRECT = 5;
const XP_BASE = 10;

function useFlipAnimation() {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = useCallback(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped((prev) => !prev);
  }, [flipAnim, isFlipped]);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return { flip, isFlipped, frontInterpolate, backInterpolate };
}

export default function FlashcardScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const list = useListsStore((state) =>
    state.lists.find((l) => l.id === listId),
  );
  const updateWordProgress = useListsStore((state) => state.updateWordProgress);
  const { awardXP, updateStreak, incrementStat, checkAndUnlockAchievements } =
    useGameStore();
  const addSession = useSessionsStore((state) => state.addSession);

  const words = list?.words ?? [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [initialMasteredCount] = useState(
    () =>
      (
        useListsStore.getState().lists.find((l) => l.id === listId)?.words ?? []
      ).filter((w) => w.status === "mastered").length,
  );

  const { flip, isFlipped, frontInterpolate, backInterpolate } =
    useFlipAnimation();

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? currentIndex / words.length : 0;

  const handleAnswer = useCallback(
    (knew: boolean) => {
      if (!list || !currentWord) return;

      // Haptic feedback on each answer
      if (knew) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(
          () => undefined,
        );
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
          () => undefined,
        );
      }

      updateWordProgress(
        list.id,
        currentWord.id,
        knew ? "correct" : "incorrect",
      );

      if (knew) {
        setCorrectCount((prev) => prev + 1);
      }

      const isLast = currentIndex === words.length - 1;

      if (isLast) {
        const duration = Math.round((Date.now() - startTime) / 1000);
        const finalCorrect = knew ? correctCount + 1 : correctCount;
        const xpEarned = XP_BASE + finalCorrect * XP_PER_CORRECT;

        updateStreak();
        awardXP(xpEarned);
        incrementStat("sessionsCompleted");
        if (finalCorrect === words.length) {
          incrementStat("listsCompleted");
        }
        const updatedWords =
          useListsStore.getState().lists.find((l) => l.id === list.id)?.words ??
          [];
        const newlyMastered =
          updatedWords.filter((w) => w.status === "mastered").length -
          initialMasteredCount;
        if (newlyMastered > 0) {
          incrementStat("wordsMastered", newlyMastered);
        }
        checkAndUnlockAchievements();

        const session = {
          id: `session-${Date.now()}`,
          listId: list.id,
          mode: "flashcard" as const,
          startedAt: new Date(startTime).toISOString(),
          completedAt: new Date().toISOString(),
          xpEarned,
          wordsReviewed: words.length,
          correctAnswers: finalCorrect,
          duration,
        };
        addSession(session);

        analyticsService.track("session_completed", {
          mode: "flashcard",
          listId: list.id,
          wordsReviewed: words.length,
          correctAnswers: finalCorrect,
          score: Math.round((finalCorrect / words.length) * 100),
          xpEarned,
          duration,
        });

        router.replace({
          pathname: "/session/summary",
          params: {
            listId: list.id,
            mode: "flashcard",
            correct: String(finalCorrect),
            total: String(words.length),
            xpEarned: String(xpEarned),
            duration: String(duration),
          },
        });
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    },
    [
      list,
      currentWord,
      currentIndex,
      correctCount,
      words.length,
      startTime,
      updateWordProgress,
      updateStreak,
      awardXP,
      incrementStat,
      checkAndUnlockAchievements,
      addSession,
      router,
      initialMasteredCount,
    ],
  );

  if (!list || words.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <H3 textAlign="center">{i18n._("session.noWords")}</H3>
        <SecondaryButton marginTop="$4" onPress={() => router.back()}>
          {i18n._("common.back")}
        </SecondaryButton>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="#FFFFFF" padding="$4">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$4"
      >
        <SecondaryButton size="$3" onPress={() => router.back()}>
          {i18n._("common.back")}
        </SecondaryButton>
        <Caption color="#D7D7D7">
          {currentIndex + 1} / {words.length}
        </Caption>
      </XStack>

      <ProgressBar progress={progress} color="primary" />

      <YStack flex={1} justifyContent="center" alignItems="center">
        <Caption color="#D7D7D7" marginBottom="$2">
          {i18n._("session.tapToReveal")}
        </Caption>

        <Pressable onPress={flip} style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                transform: [{ rotateY: frontInterpolate }],
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <ScrollView contentContainerStyle={styles.cardContent}>
              <Caption color="#D7D7D7" marginBottom="$2">
                {i18n._("session.term")}
              </Caption>
              <H2 textAlign="center">{currentWord.term}</H2>
              <BodySmall
                color="#D7D7D7"
                marginTop="$2"
                textAlign="center"
              >
                {currentWord.partOfSpeech}
              </BodySmall>
            </ScrollView>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                transform: [{ rotateY: backInterpolate }],
                backgroundColor: "#FFFFFF",
              },
            ]}
          >
            <ScrollView contentContainerStyle={styles.cardContent}>
              <Caption color="#D7D7D7" marginBottom="$2">
                {i18n._("session.translation")}
              </Caption>
              <H2 textAlign="center">{currentWord.translation}</H2>
              {currentWord.example ? (
                <Body
                  color="#D7D7D7"
                  marginTop="$3"
                  textAlign="center"
                  fontStyle="italic"
                >
                  {currentWord.example}
                </Body>
              ) : null}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </YStack>

      {isFlipped && (
        <XStack gap="$3" paddingBottom="$4">
          <YStack flex={1}>
            <YStack
              pressStyle={{ opacity: 0.8 }}
              onPress={() => handleAnswer(false)}
              backgroundColor="#FFF0EF"
              borderRadius={12}
              padding="$4"
              alignItems="center"
              gap="$1"
            >
              <H3 textAlign="center">😕</H3>
              <Label textAlign="center" color="#D53F36">
                {i18n._("session.didntKnow")}
              </Label>
            </YStack>
          </YStack>
          <YStack flex={1}>
            <YStack
              pressStyle={{ opacity: 0.8 }}
              onPress={() => handleAnswer(true)}
              backgroundColor="#E8FFF4"
              borderRadius={12}
              padding="$4"
              alignItems="center"
              gap="$1"
            >
              <H3 textAlign="center">✅</H3>
              <Label textAlign="center" color="#38AD49">
                {i18n._("session.knewIt")}
              </Label>
            </YStack>
          </YStack>
        </XStack>
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardFront: {},
  cardBack: {},
  cardContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
