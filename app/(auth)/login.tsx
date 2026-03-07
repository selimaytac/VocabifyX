import { Platform } from "react-native";
import { YStack } from "tamagui";

import { OutlineButton, PrimaryButton } from "@/components/DesignSystem/Button";
import { Body, H1 } from "@/components/DesignSystem/Typography";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { signInWithApple, signInWithGoogle } = useAuth();

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding="$6"
      backgroundColor="$background"
    >
      <YStack alignItems="center" marginBottom="$8">
        <H1 marginBottom="$2">Welcome</H1>
        <Body color="$colorSubtitle">Sign in to get started</Body>
      </YStack>

      <YStack width="100%" gap="$3">
        {Platform.OS === "ios" && (
          <PrimaryButton onPress={signInWithApple}>
            Sign in with Apple
          </PrimaryButton>
        )}

        <OutlineButton onPress={signInWithGoogle}>
          Sign in with Google
        </OutlineButton>
      </YStack>
    </YStack>
  );
}
