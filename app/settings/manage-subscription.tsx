import { ScrollView } from "react-native";
import { Spinner, YStack } from "tamagui";

import { OutlineButton, PrimaryButton } from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import { Body, H2, Label } from "@/components/DesignSystem/Typography";
import { useSubscription } from "@/hooks/useSubscription";

export default function ManageSubscriptionScreen() {
  const { isSubscribed, offerings, loading, restorePurchases } =
    useSubscription();

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <ScrollView>
      <YStack padding="$4" gap="$4">
        <Card elevated>
          <Label marginBottom="$2">Current Plan</Label>
          <H2 marginBottom="$1">{isSubscribed ? "Premium" : "Free"}</H2>
          <Body color="$colorSubtitle">
            {isSubscribed
              ? "You have access to all premium features"
              : "Upgrade to unlock all features"}
          </Body>
        </Card>

        {!isSubscribed && offerings?.current?.availablePackages && (
          <YStack gap="$3">
            {offerings.current.availablePackages.map((pkg) => (
              <Card key={pkg.identifier} elevated>
                <Label>{pkg.product.title}</Label>
                <Body color="$colorSubtitle">{pkg.product.priceString}</Body>
              </Card>
            ))}
          </YStack>
        )}

        {!isSubscribed && <PrimaryButton>Upgrade to Premium</PrimaryButton>}

        <OutlineButton onPress={restorePurchases}>
          Restore Purchases
        </OutlineButton>
      </YStack>
    </ScrollView>
  );
}
