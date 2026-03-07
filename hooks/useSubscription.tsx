import { useEffect, useState } from "react";
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
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>({
    customerInfo: null,
    offerings: null,
    isSubscribed: false,
    loading: true,
  });

  useEffect(() => {
    if (config.isDev || Platform.OS === "web") {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchSubscriptionData = async () => {
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
        });
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchSubscriptionData();

    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      const activeEntitlements = customerInfo.entitlements.active;
      const isSubscribed = Object.keys(activeEntitlements).length > 0;
      setState((prev) => ({ ...prev, customerInfo, isSubscribed }));
    });
  }, []);

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
  };
}
