import { useLingui } from "@lingui/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { XStack, YStack } from "tamagui";

import { PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { StatChip } from "@/components/DesignSystem/StatChip";
import { Body, BodySmall, H1, H3 } from "@/components/DesignSystem/Typography";

export default function SummaryScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { listId, mode, correct, total, xpEarned, duration } =
    useLocalSearchParams<{
      listId: string;
      mode: "flashcard" | "quiz";
      correct: string;
      total: string;
      xpEarned: string;
      duration: string;
    }>();

  const correctNum = Number(correct ?? 0);
  const totalNum = Number(total ?? 0);
  const xpNum = Number(xpEarned ?? 0);
  const durationNum = Number(duration ?? 0);

  const scorePercent =
    totalNum > 0 ? Math.round((correctNum / totalNum) * 100) : 0;

  const emoji = scorePercent === 100 ? "🏆" : scorePercent >= 70 ? "🎉" : "💪";

  const minutes = Math.floor(durationNum / 60);
  const seconds = durationNum % 60;
  const durationLabel = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <YStack
      flex={1}
      backgroundColor="#FFFFFF"
      padding="$4"
      justifyContent="center"
    >
      <YStack alignItems="center" gap="$3" marginBottom="$6">
        <H1>{emoji}</H1>
        <H3 textAlign="center">{i18n._("session.summary.title")}</H3>
        <Body color="#D7D7D7" textAlign="center">
          {mode === "flashcard"
            ? i18n._("session.summary.flashcardSubtitle")
            : i18n._("session.summary.quizSubtitle")}
        </Body>
      </YStack>

      <YStack backgroundColor="#F8F8F8" borderRadius={12} padding="$4" marginBottom="$4">
        <XStack gap="$2" flexWrap="wrap" justifyContent="center">
          <StatChip
            icon="✅"
            value={`${correctNum}/${totalNum}`}
            label={i18n._("session.summary.correct")}
          />
          <StatChip
            icon="🎯"
            value={`${scorePercent}%`}
            label={i18n._("session.summary.score")}
          />
          <StatChip
            icon="⚡"
            value={`+${xpNum}`}
            label={i18n._("session.summary.xpEarned")}
          />
          <StatChip
            icon="⏱"
            value={durationLabel}
            label={i18n._("session.summary.duration")}
          />
        </XStack>
      </YStack>

      {scorePercent === 100 && (
        <YStack backgroundColor="#E8FFF4" borderRadius={12} padding="$3" marginBottom="$4">
          <BodySmall color="#38AD49" textAlign="center" fontWeight="600">
            🌟 {i18n._("session.summary.perfectScore")}
          </BodySmall>
        </YStack>
      )}

      <YStack gap="$3">
        {mode === "flashcard" ? (
          <PrimaryButton
            onPress={() =>
              router.replace({
                pathname: "/session/quiz",
                params: { listId },
              })
            }
          >
            {i18n._("session.summary.tryQuiz")}
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onPress={() =>
              router.replace({
                pathname: "/session/flashcard",
                params: { listId },
              })
            }
          >
            {i18n._("session.summary.tryFlashcards")}
          </PrimaryButton>
        )}

        <SecondaryButton onPress={() => router.replace("/(tabs)")}>
          {i18n._("session.summary.backToHome")}
        </SecondaryButton>
      </YStack>
    </YStack>
  );
}
