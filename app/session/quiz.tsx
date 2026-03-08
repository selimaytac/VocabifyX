import { useLingui } from "@lingui/react";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";
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
import { useListsStore, type VocabWord } from "@/store/listsStore";
import { useSessionsStore } from "@/store/sessionsStore";

const XP_PER_CORRECT = 8;
const XP_BASE = 10;
const DISTRACTORS_COUNT = 3;

interface QuizQuestion {
  word: VocabWord;
  choices: string[];
  correctIndex: number;
}

function buildQuestions(words: VocabWord[]): QuizQuestion[] {
  const allTranslations = words.map((w) => w.translation);

  return words.map((word) => {
    const distractors = allTranslations
      .filter((t) => t !== word.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, DISTRACTORS_COUNT);

    const choices = [...distractors, word.translation].sort(
      () => Math.random() - 0.5,
    );
    const correctIndex = choices.indexOf(word.translation);

    return { word, choices, correctIndex };
  });
}

type AnswerState = "idle" | "correct" | "incorrect";

export default function QuizScreen() {
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

  const words = useMemo(() => list?.words ?? [], [list]);
  const questions = useMemo(() => buildQuestions(words), [words]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [startTime] = useState(() => Date.now());
  const [initialMasteredCount] = useState(
    () =>
      (
        useListsStore.getState().lists.find((l) => l.id === listId)?.words ?? []
      ).filter((w) => w.status === "mastered").length,
  );
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? currentIndex / questions.length : 0;

  const handleChoice = useCallback(
    (choiceIndex: number) => {
      if (answerState !== "idle" || !list || !currentQuestion) return;

      const isCorrect = choiceIndex === currentQuestion.correctIndex;
      setSelectedChoice(choiceIndex);
      setAnswerState(isCorrect ? "correct" : "incorrect");

      // Haptic feedback for quiz answers
      if (isCorrect) {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
          () => undefined,
        );
      }

      updateWordProgress(
        list.id,
        currentQuestion.word.id,
        isCorrect ? "correct" : "incorrect",
      );

      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
      }

      advanceTimer.current = setTimeout(() => {
        const isLast = currentIndex === questions.length - 1;

        if (isLast) {
          const duration = Math.round((Date.now() - startTime) / 1000);
          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
          const xpEarned = XP_BASE + finalCorrect * XP_PER_CORRECT;
          const isPerfect = finalCorrect === questions.length;

          updateStreak();
          awardXP(xpEarned);
          incrementStat("sessionsCompleted");
          if (isPerfect) {
            incrementStat("quizPerfectScores");
          }
          const updatedWords =
            useListsStore.getState().lists.find((l) => l.id === list.id)
              ?.words ?? [];
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
            mode: "quiz" as const,
            startedAt: new Date(startTime).toISOString(),
            completedAt: new Date().toISOString(),
            xpEarned,
            wordsReviewed: questions.length,
            correctAnswers: finalCorrect,
            duration,
          };
          addSession(session);

          analyticsService.track("session_completed", {
            mode: "quiz",
            listId: list.id,
            wordsReviewed: questions.length,
            correctAnswers: finalCorrect,
            score: Math.round((finalCorrect / questions.length) * 100),
            xpEarned,
            duration,
            isPerfect,
          });

          router.replace({
            pathname: "/session/summary",
            params: {
              listId: list.id,
              mode: "quiz",
              correct: String(finalCorrect),
              total: String(questions.length),
              xpEarned: String(xpEarned),
              duration: String(duration),
            },
          });
        } else {
          setCurrentIndex((prev) => prev + 1);
          setAnswerState("idle");
          setSelectedChoice(null);
        }
      }, 1000);
    },
    [
      answerState,
      list,
      currentQuestion,
      currentIndex,
      correctCount,
      questions.length,
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

  if (!list || words.length < 2) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <H3 textAlign="center">{i18n._("session.notEnoughWords")}</H3>
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
          {currentIndex + 1} / {questions.length}
        </Caption>
      </XStack>

      <ProgressBar progress={progress} color="primary" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingVertical="$4" gap="$4">
          <YStack
            backgroundColor="#F8F8F8"
            borderRadius={12}
            padding="$4"
          >
            <YStack gap="$2" paddingVertical="$2">
              <Caption color="#D7D7D7">
                {i18n._("session.whatIsTranslation")}
              </Caption>
              <H2 textAlign="center">{currentQuestion.word.term}</H2>
              <BodySmall color="#D7D7D7" textAlign="center">
                {currentQuestion.word.partOfSpeech}
              </BodySmall>
            </YStack>
          </YStack>

          <YStack gap="$3">
            {currentQuestion.choices.map((choice, index) => {
              const isSelected = selectedChoice === index;
              const isCorrectChoice = index === currentQuestion.correctIndex;
              const choiceKey = `choice-${currentIndex}-${index}`;

              let bg = "#F8F8F8";
              let labelColor = "#131313";

              if (answerState !== "idle") {
                if (isCorrectChoice) {
                  bg = "#E8FFF4";
                  labelColor = "#38AD49";
                } else if (isSelected && !isCorrectChoice) {
                  bg = "#FFF0EF";
                  labelColor = "#D53F36";
                }
              }

              return (
                <YStack
                  key={choiceKey}
                  pressStyle={
                    answerState === "idle" ? { opacity: 0.8 } : undefined
                  }
                  onPress={() => handleChoice(index)}
                  backgroundColor={bg as never}
                  borderRadius={12}
                  padding="$4"
                >
                  <XStack alignItems="center" gap="$3">
                    <Body fontSize={18} width={24} textAlign="center">
                      {answerState !== "idle" && isCorrectChoice
                        ? "✅"
                        : answerState !== "idle" && isSelected
                          ? "❌"
                          : String.fromCharCode(65 + index)}
                    </Body>
                    <Label color={labelColor as never} flex={1}>
                      {choice}
                    </Label>
                  </XStack>
                </YStack>
              );
            })}
          </YStack>

          {answerState !== "idle" && (
            <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4">
              <BodySmall
                color="#D7D7D7"
                fontStyle="italic"
                textAlign="center"
              >
                {currentQuestion.word.example}
              </BodySmall>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
