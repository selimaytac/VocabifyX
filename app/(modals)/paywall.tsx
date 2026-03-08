import { useLingui } from "@lingui/react";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { PACKAGE_TYPE, type PurchasesPackage } from "react-native-purchases";
import { Spinner, XStack, YStack } from "tamagui";

import { OutlineButton, PrimaryButton } from "@/components/DesignSystem/Button";
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

/**
 * Lapsed-subscriber hard paywall modal.
 * Shown when the user's subscription has expired.
 * There is no dismiss / skip button — the only exits are:
 *  1. Subscribe (re-activates access)
 *  2. Restore Purchases
 */
export default function LapsedPaywallScreen() {
  const { i18n } = useLingui();
  const {
    offerings,
    loading,
    purchasePackage,
    restorePurchases,
    isSubscribed,
  } = useSubscription();

  const packages = offerings?.current?.availablePackages ?? [];
  const annualPkg = packages.find(isAnnualPackage) ?? packages[0] ?? null;

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  // Pre-select the annual plan once offerings have loaded
  useEffect(() => {
    if (annualPkg && !selectedPkgId) {
      setSelectedPkgId(annualPkg.identifier);
    }
  }, [annualPkg, selectedPkgId]);

  // Track impression
  useEffect(() => {
    analyticsService.track("lapsed_paywall_shown");
  }, []);

  const selectedPackage =
    packages.find((p) => p.identifier === selectedPkgId) ?? annualPkg;

  // If subscription was just restored/purchased, parent layout will
  // re-check entitlement and remove this modal from view — no explicit
  // navigation needed here.

  const headline = i18n._("paywall.lapsed.headline");

  const handleSubscribe = async () => {
    if (!selectedPackage) return;
    setPurchasing(true);
    try {
      await purchasePackage(selectedPackage);
      analyticsService.track("lapsed_paywall_purchase_completed", {
        packageId: selectedPackage.identifier,
      });
    } catch {
      // Cancelled or failed — stay on the paywall
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      analyticsService.track("lapsed_paywall_restore_tapped");
    } catch {
      // Silently ignore restore errors
    }
  };

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

  // If the subscription check returned active after a restore/purchase on
  // this screen, the tabs layout useEffect will navigate away from the modal.
  // We also guard here so the user isn't stuck looking at a paywall they
  // just resolved.
  if (isSubscribed) {
    return null;
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack padding="$5" gap="$5">
          {/* Header */}
          <YStack alignItems="center" gap="$3" paddingTop="$6">
            <Body fontSize={56}>🔒</Body>
            <H2 textAlign="center">{headline}</H2>
            <BodySmall color="$colorSubtitle" textAlign="center">
              {i18n._("paywall.lapsed.subtitle")}
            </BodySmall>
          </YStack>

          {/* Feature list */}
          <YStack gap="$2">
            {FEATURE_KEYS.map((key) => (
              <XStack key={key} gap="$3" alignItems="center">
                <Label color="$blue10">✓</Label>
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
                    borderWidth={2}
                    borderColor={isSelected ? "$blue10" : "$borderColor"}
                    backgroundColor={isSelected ? "$blue2" : "$background"}
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
                              backgroundColor="$blue10"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius={8}
                            >
                              <Caption color="$white1" fontSize={10}>
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
                      {isSelected && <Caption color="$blue10">✓</Caption>}
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

      {/* Bottom actions — no "Not Now" / dismiss button */}
      <YStack padding="$5" paddingBottom="$8" gap="$3">
        <PrimaryButton
          onPress={handleSubscribe}
          disabled={purchasing || !selectedPackage}
        >
          {purchasing
            ? i18n._("paywall.processing")
            : i18n._("paywall.lapsed.renewCta")}
        </PrimaryButton>
        <OutlineButton onPress={handleRestore}>
          {i18n._("paywall.restore")}
        </OutlineButton>
      </YStack>
    </YStack>
  );
}
