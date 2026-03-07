import { useRouter } from "expo-router";
import { useCallback } from "react";

import { useSubscription } from "@/hooks/useSubscription";

interface EntitlementHook {
  isSubscribed: boolean;
  loading: boolean;
  /**
   * Calls `action` immediately when the user has an active subscription.
   * Navigates to the paywall screen otherwise.
   */
  requirePremium: (action: () => void) => void;
}

export function useEntitlement(): EntitlementHook {
  const { isSubscribed, loading } = useSubscription();
  const router = useRouter();

  const requirePremium = useCallback(
    (action: () => void) => {
      if (isSubscribed) {
        action();
      } else {
        router.push("/paywall");
      }
    },
    [isSubscribed, router],
  );

  return { isSubscribed, loading, requirePremium };
}
