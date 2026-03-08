import { useLingui } from "@lingui/react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { PACKAGE_TYPE, type PurchasesPackage } from "react-native-purchases";
import { Spinner, XStack, YStack } from "tamagui";

import {
  OutlineButton,
  PrimaryButton,
  SecondaryButton,
} from "@/components/DesignSystem/Button";
import { Card } from "@/components/DesignSystem/Card";
import {
  Body,
  BodySmall,
  Caption,
  H2,
  Label,
} from "@/components/DesignSystem/Typography";
import { useSubscription } from "@/hooks/useSubscription";
import { analyticsService } from "@/services/analytics/analytics.service";
import { useUserStore } from "@/store/userStore";

const FEATURE_KEYS = [
  "paywall.feature1",
  "paywall.feature2",
  "paywall.feature3",
  "paywall.feature4",
  "paywall.feature5",
] as const;

function isAnnualPackage(pkg: PurchasesPackage): boolean {
  return (
    pkg.packageType === PACKAGE_TYPE.ANNUAL ||
    pkg.identifier.toLowerCase().includes("annual") ||
    pkg.identifier.toLowerCase().includes("yearly")
  );
}

export default function PaywallScreen() {
  const { i18n } = useLingui();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const onboardingTopic = useUserStore((s) => s.onboardingTopic);
  const onboardingWordCount = useUserStore((s) => s.onboardingWordCount);
  const {
    offerings,
    loading,
    purchasePackage,
    restorePurchases,
    isSubscribed,
  } = useSubscription();

  const packages = offerings?.current?.availablePackages ?? [];
  // Prefer the annual package; fall back to the first available package so
  // there is always something to pre-select when an annual plan is absent.
  const annualPkg = packages.find(isAnnualPackage) ?? packages[0] ?? null;

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // Pre-select the annual plan once offerings have loaded
  useEffect(() => {
    if (annualPkg && !selectedPkgId) {
      setSelectedPkgId(annualPkg.identifier);
    }
  }, [annualPkg, selectedPkgId]);

  const selectedPackage =
    packages.find((p) => p.identifier === selectedPkgId) ?? annualPkg;

  if (isSubscribed) {
    router.replace("/(tabs)");
    return null;
  }

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    setPurchasing(true);
    try {
      await purchasePackage(selectedPackage);
      analyticsService.track("paywall_purchase_completed", {
        packageId: selectedPackage.identifier,
      });
      router.replace("/(tabs)");
    } catch {
      // Purchase was cancelled or failed – stay on paywall
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      analyticsService.track("paywall_restore_tapped");
    } catch {
      // Silently ignore restore errors
    }
  };

  const handleDismiss = () => {
    analyticsService.track("paywall_dismissed");
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  const displayName = profile?.displayName ?? "";
  const headline = onboardingTopic
    ? i18n
        ._("paywall.headlineTopic")
        .replace("{name}", displayName || i18n._("onboarding.name.placeholder"))
    : displayName
      ? i18n._("paywall.headlinePersonal").replace("{name}", displayName)
      : i18n._("paywall.headlineDefault");

  const subtitle =
    onboardingTopic && onboardingWordCount
      ? i18n
          ._("paywall.subtitleTopic")
          .replace("{wordCount}", String(onboardingWordCount))
          .replace("{topic}", onboardingTopic)
      : null;

  if (loading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack padding="$5" gap="$5">
          {/* Header */}
          <YStack alignItems="center" gap="$3" paddingTop="$6">
            <Body fontSize={56}>⭐</Body>
            <H2 textAlign="center">{i18n._("paywall.title")}</H2>
            <BodySmall color="$colorSubtitle" textAlign="center">
              {headline}
            </BodySmall>
            {subtitle && (
              <BodySmall color="$colorSubtitle" textAlign="center">
                {subtitle}
              </BodySmall>
            )}
          </YStack>

          {/* Feature list */}
          <YStack gap="$2">
            {FEATURE_KEYS.map((key) => (
              <XStack key={key} gap="$3" alignItems="center">
                <Label color="#F5A623">✓</Label>
                <Body>{i18n._(key)}</Body>
              </XStack>
            ))}
          </YStack>

          {/* Package selection */}
          {packages.length > 0 ? (
            <YStack gap="$3">
              {packages.map((pkg) => {
                const isSelected = selectedPkgId === pkg.identifier;
                const isAnnual = isAnnualPackage(pkg);
                return (
                  <Card
                    key={pkg.identifier}
                    pressStyle={{ opacity: 0.8 }}
                    onPress={() => setSelectedPkgId(pkg.identifier)}
                    borderWidth={1}
                    borderColor={isSelected ? "#F5A623" : "#333333"}
                    backgroundColor={isSelected ? "#3d2d0a" : "#1e1e1e"}
                  >
                    <XStack justifyContent="space-between" alignItems="center">
                      <YStack flex={1}>
                        <XStack gap="$2" alignItems="center">
                          <Label>
                            {pkg.product.title ||
                              (isAnnual
                                ? i18n._("paywall.annualPlan")
                                : i18n._("paywall.monthlyPlan"))}
                          </Label>
                          {isAnnual && (
                            <XStack
                              backgroundColor="#F5A623"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius={8}
                            >
                              <Caption color="#1a1a1a" fontSize={10} fontWeight="700">
                                {i18n._("paywall.mostPopular")}
                              </Caption>
                            </XStack>
                          )}
                        </XStack>
                        <Caption color="$colorSubtitle">
                          {pkg.product.priceString}
                          {isAnnual
                            ? ` ${i18n._("paywall.perYear")}`
                            : ` ${i18n._("paywall.perMonth")}`}
                        </Caption>
                      </YStack>
                      {isSelected && <Caption color="#F5A623" fontSize={18}>✓</Caption>}
                    </XStack>
                  </Card>
                );
              })}
            </YStack>
          ) : (
            <Card elevated>
              <YStack alignItems="center" gap="$2" padding="$2">
                <Label>{i18n._("paywall.annualPlan")}</Label>
                <Caption color="$colorSubtitle">
                  {i18n._("paywall.noOfferings")}
                </Caption>
              </YStack>
            </Card>
          )}

          {/* Legal note */}
          <Caption color="$colorSubtitle" textAlign="center" fontSize={11}>
            {i18n._("paywall.legalNote")}
          </Caption>
        </YStack>
      </ScrollView>

      {/* Bottom actions */}
      <YStack padding="$5" paddingBottom="$8" gap="$3">
        <PrimaryButton
          onPress={handleSubscribe}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing
            ? i18n._("paywall.processing")
            : i18n._("paywall.subscribe")}
        </PrimaryButton>
        <OutlineButton onPress={handleRestore}>
          {i18n._("paywall.restore")}
        </OutlineButton>
        <SecondaryButton onPress={handleDismiss}>
          {i18n._("paywall.noThanks")}
        </SecondaryButton>
      </YStack>
    </YStack>
  );
}
