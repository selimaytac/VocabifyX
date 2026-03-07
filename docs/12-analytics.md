# VocabifyX – Analytics & Remote Config

> **Reference:** [Architecture](./03-app-architecture.md) · [Monetization](./10-monetization.md)

---

## Analytics Stack

| Tool | Purpose |
|------|---------|
| **Amplitude** | Product analytics (user events, funnels, retention) |
| **Firebase Remote Config** | Feature flags, A/B testing, copy variants |
| **Firebase Crashlytics** | Crash reporting, ANR tracking |
| **RevenueCat** | Revenue & subscription analytics |
| *(Post-MVP)* AppsFlyer | Attribution & paid campaign tracking |

---

## Amplitude – Event Catalogue

### App Lifecycle
```typescript
track('app_opened', { source: 'cold_start' | 'push_notification' | 'background' })
track('app_session_started', { sessionCount })
```

### Onboarding
```typescript
track('onboarding_started')
track('onboarding_step_completed', { step: number, stepName: string })
track('onboarding_step_skipped', { step: number })
track('onboarding_first_list_generated', { topic, topicCategory, wordCount })
track('onboarding_paywall_shown')
track('onboarding_trial_started', { plan, trialDays })
track('onboarding_completed')
```

### List Management
```typescript
track('list_creation_started', { source: 'home_fab' | 'onboarding' })
track('list_generation_started', { topic, topicCategory, wordCount, hasDescription })
track('list_generation_succeeded', { wordCount, durationMs, modelUsed })
track('list_generation_failed', { errorType })
track('list_opened', { listId, wordCount, source: 'home' | 'explore' })
track('list_deleted', { listId })
```

### Learning Session
```typescript
track('session_started', { listId, mode: 'flashcard' | 'quiz' })
track('session_completed', { listId, mode, wordsReviewed, xpEarned, durationMs })
track('session_abandoned', { listId, mode, progress })
track('flashcard_known', { listId, wordId })
track('flashcard_unknown', { listId, wordId })
track('quiz_answered', { listId, questionType, correct, timeSpentMs })
```

### Explore
```typescript
track('explore_screen_viewed')
track('explore_category_filtered', { category })
track('explore_list_viewed', { listId, listName })
track('explore_list_added', { listId, listName })
```

### Gamification
```typescript
track('xp_earned', { amount, source, totalXp })
track('level_up', { fromLevel, toLevel, tierName })
track('achievement_unlocked', { achievementId, achievementName })
track('streak_updated', { streakDays })
track('streak_lost', { previousStreak })
```

### Monetization
```typescript
track('paywall_shown', { trigger, paywallVariant })
track('paywall_trial_started', { plan, trialDays, price })
track('paywall_purchased', { plan, price, isUpgrade })
track('paywall_dismissed', { trigger })
track('premium_feature_gated', { feature, trigger })
```

### Notifications
```typescript
track('notification_permission_requested')
track('notification_permission_granted')
track('notification_permission_denied')
track('notification_tapped', { type, trigger })
```

---

## Amplitude – User Properties

```typescript
identify({
  app_language: 'TR' | 'EN',
  native_language: 'TR' | 'EN',
  level_tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Legend',
  level_number: number,
  total_xp: number,
  streak_days: number,
  is_premium: boolean,
  total_lists: number,
  total_words_mastered: number,
  onboarding_completed: boolean,
})
```

---

## Firebase Remote Config

### Config Keys

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `ai_model` | string | `gpt-4o-mini` | Active AI model |
| `word_count_options` | JSON | `[15,30,50]` | Available word count options |
| `trial_duration` | number | `7` | Free trial days |
| `paywall_allow_skip` | bool | `false` | Allow skipping paywall |
| `paywall_highlighted_plan` | string | `annual` | Which plan gets "Best Value" badge |
| `paywall_headline_en` | string | `"..."` | Paywall headline copy (EN) |
| `paywall_headline_tr` | string | `"..."` | Paywall headline copy (TR) |
| `quiz_timer_enabled` | bool | `false` | Show countdown timer in quiz |
| `quiz_timer_seconds` | number | `15` | Timer duration per question |
| `max_notifs_per_day` | number | `3` | Max daily notifications |
| `explore_featured_list_ids` | JSON | `[]` | IDs to feature at top of Explore |
| `maintenance_mode` | bool | `false` | Show maintenance banner |

### Implementation

```typescript
// hooks/useRemoteConfig.ts
import remoteConfig from '@react-native-firebase/remote-config'

export const initRemoteConfig = async () => {
  await remoteConfig().setDefaults({ /* defaults */ })
  await remoteConfig().fetchAndActivate()
}

export const getConfig = <T>(key: string, fallback: T): T => {
  const value = remoteConfig().getValue(key)
  // parse based on expected type
}
```

---

## Firebase Crashlytics

```typescript
// services/firebase/crashlytics.ts
import crashlytics from '@react-native-firebase/crashlytics'

export const logError = (error: Error, context?: Record<string, string>) => {
  if (context) {
    Object.entries(context).forEach(([k, v]) => crashlytics().setAttribute(k, v))
  }
  crashlytics().recordError(error)
}

export const setUserContext = (userId: string, isPremium: boolean) => {
  crashlytics().setUserId(userId)
  crashlytics().setAttribute('is_premium', String(isPremium))
}
```

Non-fatal errors logged: AI generation failures, RC fetch failures, RevenueCat errors.
