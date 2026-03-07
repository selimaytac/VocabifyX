import { useRouter } from "expo-router";
import { useState } from "react";
import { XStack, YStack } from "tamagui";

import {
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { Body, H2 } from "@/components/DesignSystem/Typography";
import { useUserStore } from "@/store/userStore";

const ONBOARDING_STEPS = [
  {
    title: "Welcome to App",
    description: "Discover all the features that will help you every day.",
  },
  {
    title: "Personalize",
    description: "Customize your experience to match your preferences.",
  },
  {
    title: "Stay Connected",
    description: "Enable notifications to never miss important updates.",
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const setHasCompletedOnboarding = useUserStore(
    (state) => state.setHasCompletedOnboarding,
  );
  const router = useRouter();

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      setHasCompletedOnboarding(true);
      router.replace("/(tabs)");
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setHasCompletedOnboarding(true);
    router.replace("/(tabs)");
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      backgroundColor="$background"
    >
      <YStack flex={1} justifyContent="center" alignItems="center">
        <H2 marginBottom="$3" textAlign="center">
          {step.title}
        </H2>
        <Body color="$colorSubtitle" textAlign="center">
          {step.description}
        </Body>
      </YStack>

      <XStack gap="$2" marginBottom="$4">
        {ONBOARDING_STEPS.map((s, stepIndex) => (
          <YStack
            key={s.title}
            width={8}
            height={8}
            borderRadius={4}
            backgroundColor={stepIndex === currentStep ? "$blue10" : "$gray6"}
          />
        ))}
      </XStack>

      <YStack width="100%" gap="$3">
        <PrimaryButton onPress={handleNext}>
          {isLastStep ? "Get Started" : "Next"}
        </PrimaryButton>
        {!isLastStep && (
          <SecondaryButton onPress={handleSkip}>Skip</SecondaryButton>
        )}
      </YStack>
    </YStack>
  );
}
