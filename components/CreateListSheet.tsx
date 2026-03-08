import { useLingui } from "@lingui/react";
import { Compass, PenTool, Sparkles } from "@tamagui/lucide-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Sheet, XStack, YStack } from "tamagui";

import {
  Body,
  BodySmall,
  Caption,
  H3,
} from "@/components/DesignSystem/Typography";
import { useCreateListSheetStore } from "@/store/createListSheetStore";

export function CreateListSheet() {
  const { i18n } = useLingui();
  const router = useRouter();
  const isOpen = useCreateListSheetStore((s) => s.isOpen);
  const close = useCreateListSheetStore((s) => s.close);

  useEffect(() => {
    if (isOpen) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
        () => undefined,
      );
    }
  }, [isOpen]);

  const handleManualCreate = () => {
    close();
    setTimeout(() => {
      router.push("/list/create");
    }, 300);
  };

  const handleAICreate = () => {
    close();
    setTimeout(() => {
      router.push("/list/ai-create");
    }, 300);
  };

  const handleExplore = () => {
    close();
    setTimeout(() => {
      router.push("/(tabs)/explore");
    }, 300);
  };

  return (
    <Sheet
      modal
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) close();
      }}
      snapPoints={[42]}
      dismissOnSnapToBottom
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        backgroundColor="#FFFFFF"
        padding="$4"
        paddingBottom="$6"
        borderTopLeftRadius={24}
        borderTopRightRadius={24}
      >
        <YStack gap="$4">
          {/* Explore Banner */}
          <XStack
            backgroundColor="#E5F2FF"
            borderRadius={16}
            padding="$3.5"
            alignItems="center"
            gap="$3"
            pressStyle={{ opacity: 0.85, scale: 0.98 }}
            onPress={handleExplore}
            animation="quick"
          >
            <XStack
              width={40}
              height={40}
              borderRadius={12}
              backgroundColor="#547792"
              alignItems="center"
              justifyContent="center"
            >
              <Compass size={22} color="white" />
            </XStack>
            <YStack flex={1}>
              <Body fontWeight="700" color="#213448" fontSize={15}>
                {i18n._("createSheet.exploreBanner")}
              </Body>
              <Caption color="#547792" fontSize={12}>
                {i18n._("createSheet.exploreBannerSub")}
              </Caption>
            </YStack>
            <Body color="#547792" fontSize={20}>
              →
            </Body>
          </XStack>

          {/* Two Option Cards */}
          <XStack gap="$3">
            {/* Manual Create Card */}
            <YStack
              flex={1}
              backgroundColor="#F7F8FB"
              borderRadius={16}
              padding="$4"
              alignItems="center"
              justifyContent="center"
              gap="$3"
              pressStyle={{ opacity: 0.85, scale: 0.96 }}
              onPress={handleManualCreate}
              animation="quick"
              borderWidth={1.5}
              borderColor="rgba(33, 52, 72, 0.08)"
              minHeight={160}
            >
              <XStack
                width={56}
                height={56}
                borderRadius={16}
                backgroundColor="#213448"
                alignItems="center"
                justifyContent="center"
              >
                <PenTool size={26} color="white" />
              </XStack>
              <YStack alignItems="center" gap="$1">
                <Body
                  fontWeight="700"
                  color="#09122C"
                  fontSize={14}
                  textAlign="center"
                >
                  {i18n._("createSheet.manualTitle")}
                </Body>
                <BodySmall
                  color="#777777"
                  fontSize={12}
                  textAlign="center"
                  numberOfLines={2}
                >
                  {i18n._("createSheet.manualSubtitle")}
                </BodySmall>
              </YStack>
            </YStack>

            {/* AI Create Card */}
            <YStack
              flex={1}
              backgroundColor="#F7F8FB"
              borderRadius={16}
              padding="$4"
              alignItems="center"
              justifyContent="center"
              gap="$3"
              pressStyle={{ opacity: 0.85, scale: 0.96 }}
              onPress={handleAICreate}
              animation="quick"
              borderWidth={1.5}
              borderColor="rgba(225, 117, 100, 0.15)"
              minHeight={160}
            >
              <XStack
                width={56}
                height={56}
                borderRadius={16}
                backgroundColor="#E17564"
                alignItems="center"
                justifyContent="center"
              >
                <Sparkles size={26} color="white" />
              </XStack>
              <YStack alignItems="center" gap="$1">
                <Body
                  fontWeight="700"
                  color="#09122C"
                  fontSize={14}
                  textAlign="center"
                >
                  {i18n._("createSheet.aiTitle")}
                </Body>
                <BodySmall
                  color="#777777"
                  fontSize={12}
                  textAlign="center"
                  numberOfLines={2}
                >
                  {i18n._("createSheet.aiSubtitle")}
                </BodySmall>
              </YStack>
            </YStack>
          </XStack>

          {/* Cancel */}
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            pressStyle={{ opacity: 0.7 }}
            onPress={close}
          >
            <H3 color="#777777" fontSize={15} fontWeight="500">
              {i18n._("common.cancel")}
            </H3>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
}
