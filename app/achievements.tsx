import { useLingui } from "@lingui/react";
import { ArrowLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

import { Card } from "@/components/DesignSystem/Card";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  Label,
} from "@/components/DesignSystem/Typography";
import { ACHIEVEMENTS } from "@/constants/achievements";
import { useGameStore } from "@/store/gameStore";

export default function AchievementsScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const unlockedIds = new Set(
    useGameStore((s) => s.achievements).map((a) => a.achievementId),
  );

  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    unlockedIds.has(a.id),
  ).length;

  return (
    <ScrollView>
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
          <H2>{i18n._("achievements.title")}</H2>
        </XStack>

        <Caption color="$colorSubtitle">
          {unlockedCount} / {ACHIEVEMENTS.length}{" "}
          {i18n._("achievements.unlocked")}
        </Caption>

        <YStack gap="$3">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            return (
              <Card
                key={achievement.id}
                elevated
                opacity={isUnlocked ? 1 : 0.5}
              >
                <XStack alignItems="center" gap="$3">
                  <XStack
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={
                      isUnlocked ? achievement.badgeColor : "$gray5"
                    }
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Body fontSize={22}>
                      {isUnlocked ? achievement.icon : "🔒"}
                    </Body>
                  </XStack>
                  <YStack flex={1} gap="$1">
                    <XStack justifyContent="space-between" alignItems="center">
                      <Label>{i18n._(achievement.titleKey)}</Label>
                      {isUnlocked && (
                        <Caption color="$green10">
                          +{achievement.xpReward} XP
                        </Caption>
                      )}
                    </XStack>
                    <BodySmall color="$colorSubtitle">
                      {i18n._(achievement.descriptionKey)}
                    </BodySmall>
                    {!isUnlocked && (
                      <Caption color="$colorSubtitle">
                        {i18n._("achievements.locked")}
                      </Caption>
                    )}
                  </YStack>
                </XStack>
              </Card>
            );
          })}
        </YStack>
      </YStack>
    </ScrollView>
  );
}
