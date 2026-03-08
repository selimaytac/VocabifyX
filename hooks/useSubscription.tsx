import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type PurchasesOfferings,
} from "react-native-purchases";

import { config } from "@/config";

interface SubscriptionState {
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  isSubscribed: boolean;
  loading: boolean;
  offeringsError: boolean;
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    customerInfo: null,
    offerings: null,
    isSubscribed: false,
    loading: true,
    offeringsError: false,
  });

  const fetchSubscriptionData = useCallback(async () => {
    if (config.isDev || Platform.OS === "web") {
      setState((prev) => ({ ...prev, loading: false, offeringsError: false }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, offeringsError: false }));

    try {
      const [customerInfo, offerings] = await Promise.all([
        Purchases.getCustomerInfo(),
        Purchases.getOfferings(),
      ]);

      const activeEntitlements = customerInfo.entitlements.active;
      const isSubscribed = Object.keys(activeEntitlements).length > 0;

      setState({
        customerInfo,
        offerings,
        isSubscribed,
        loading: false,
        offeringsError: false,
      });
    } catch {
      setState((prev) => ({ ...prev, loading: false, offeringsError: true }));
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionData();

    if (config.isDev || Platform.OS === "web") return;

    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const activeEntitlements = customerInfo.entitlements.active;
      const isSubscribed = Object.keys(activeEntitlements).length > 0;
      setState((prev) => ({ ...prev, customerInfo, isSubscribed }));
    });
  }, [fetchSubscriptionData]);

  const purchasePackage = async (packageToPurchase: any) => {
    if (config.isDev || Platform.OS === "web") return null;
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  };

  const restorePurchases = async () => {
    if (config.isDev || Platform.OS === "web") return null;
    return await Purchases.restorePurchases();
  };

  return {
    ...state,
    purchasePackage,
    restorePurchases,
    refetch: fetchSubscriptionData,
  };
}
