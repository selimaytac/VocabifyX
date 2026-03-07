# VocabifyX – Monetization

> **Reference:** [Onboarding](./09-onboarding.md) · [Architecture](./03-app-architecture.md)

---

## Strategy

**Hard paywall after onboarding — no free tier.**

The user goes through onboarding, creates their first list, **sees it**, gets excited — then hits a paywall requiring a free trial to continue. There is no way to use the app without starting a trial. The paywall is the gate between onboarding completion and the main app.

**Goal:** Maximise trial start rate by delivering genuine value *before* the paywall appears. By the time the user sees the paywall, they've already built something they want to use.

---

## Subscription Plans

Plans are defined entirely in **App Store Connect + RevenueCat dashboard**. No prices are hardcoded in the app. RevenueCat fetches current offerings at runtime.

**Plan tiers (examples — set in RC dashboard):**
- Weekly
- Monthly
- Annual ← highlighted as "Best Value" (controlled via Firebase Remote Config: `paywall_highlighted_plan`)

---

## Free Trial

Trial duration is controlled via **Firebase Remote Config** key: `trial_duration` (default: `7` days).

The app always shows trial as the CTA — never a direct purchase prompt on first encounter.

---

## Paywall Behaviour

- **No skip allowed.** The paywall has no "Maybe later" or close button.
- The only exit from the paywall is: start free trial → enter app, or go back to onboarding.
- After trial expires, RevenueCat blocks access → paywall shown again (with options to subscribe).
- Lapsed subscribers re-hit the same paywall.

---

## Paywall UI

Built directly with React Native (no expo-superwall). The paywall screen lives at:
`app/onboarding/paywall.tsx` and `app/(modals)/paywall.tsx` (for lapsed subscribers).

**Paywall screen layout:**
```
┌──────────────────────────────────┐
│  ✨ VocabifyX Premium            │
│                                  │
│  "Your first list is ready.      │
│   Start your free trial to       │
│   start learning."               │
│                                  │
│  ✅ Unlimited AI-generated lists │
│  ✅ Flashcards & Quizzes         │
│  ✅ Progress tracking            │
│  ✅ Achievements & Levels        │
│                                  │
│  [ Plan selector: W / M / Y ]    │
│                                  │
│  [ Start Free Trial → ]          │  ← primary CTA
│                                  │
│  Cancel anytime · Auto-renews    │
└──────────────────────────────────┘
```

Paywall copy (headline, benefit bullets) controlled via Firebase Remote Config for A/B testing without app updates.

---

## RevenueCat Integration

```typescript
// services/revenuecat/index.ts
import Purchases from 'react-native-purchases'

export const initPurchases = () => {
  Purchases.configure({
    apiKey: Platform.OS === 'ios' ? RC_IOS_KEY : RC_ANDROID_KEY,
  })
}

export const checkEntitlement = async (): Promise<boolean> => {
  const customerInfo = await Purchases.getCustomerInfo()
  return customerInfo.entitlements.active['premium'] !== undefined
}

export const getOfferings = async () => {
  return await Purchases.getOfferings()
}

export const purchasePackage = async (pkg: PurchasesPackage) => {
  return await Purchases.purchasePackage(pkg)
}
```

### `useEntitlement` Hook

```typescript
// hooks/useEntitlement.ts
export const useEntitlement = () => {
  const [isPremium, setIsPremium] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkEntitlement().then(setIsPremium).finally(() => setIsLoading(false))

    const listener = Purchases.addCustomerInfoUpdateListener((info) => {
      setIsPremium(info.entitlements.active['premium'] !== undefined)
    })
    return () => listener.remove()
  }, [])

  return { isPremium, isLoading }
}
```

---

## Firebase Remote Config Keys (Paywall)

| Key | Default | Description |
|-----|---------|-------------|
| `trial_duration` | `7` | Number of trial days shown in paywall |
| `paywall_highlighted_plan` | `annual` | Which plan gets "Best Value" badge |
| `paywall_headline_en` | `"..."` | Paywall headline copy (EN) |
| `paywall_headline_tr` | `"..."` | Paywall headline copy (TR) |

---

## Analytics Events

```typescript
track('paywall_shown', { trigger: 'onboarding' | 'lapsed' })
track('paywall_trial_started', { plan, trialDays })
track('paywall_purchased', { plan })
track('paywall_plan_switched', { fromPlan, toPlan })
```

---

## Future Monetization (Post-MVP)

| Feature | Type | Notes |
|---------|------|-------|
| Lifetime purchase | One-time IAP | High-LTV segment |
| Referral programme | Growth | Reduce CAC |
| Corporate/Team plan | Subscription | B2B expansion |
