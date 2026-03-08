# VocabifyX – Development Roadmap

> **Reference:** [MVP Scope](./02-mvp-scope.md)  
> **Stack:** Expo 55 · Tamagui · Zustand · RevenueCat · Amplitude · Firebase

---

## Timeline Overview

```
Week 1–2:   Foundation (setup, design system, navigation, stores)
Week 3–4:   Core Feature (AI generation + list management)
Week 5:     Learning Engine (flashcards + quiz)
Week 6:     Gamification + Stats
Week 7:     Onboarding + Paywall + Notifications
Week 8:     Polish, QA, Submission
```

---

## Sprint 1 – Foundation & Design System (Week 1–2)

### Setup & Config
- [ ] Rename project (`app-template` → `VocabifyX`)
- [ ] Configure `app.json` (bundle ID, version, icons, splash)
- [ ] Set up `tamagui.config.ts` with VocabifyX tokens (colours, typography, spacing)
- [ ] Configure Lingui (extract → compile, EN + TR catalogues)
- [ ] Set up `.env` with all SDK keys (Amplitude, Firebase, RevenueCat, Supabase)
- [ ] Initialize Amplitude (identify call, app_opened event)
- [ ] Initialize Firebase (Crashlytics + Remote Config defaults)
- [ ] Initialize RevenueCat (configure + entitlement check)

### Navigation Skeleton
- [ ] 5-tab bottom navigation (Home, Explore, +FAB, Stats, Profile)
- [ ] Placeholder screens for all 5 tabs
- [ ] Onboarding stack with navigation guard (redirect if not complete)
- [ ] Create List bottom sheet (empty form)
- [ ] List Detail screen (empty)
- [ ] Flashcard session screen (empty)
- [ ] Quiz session screen (empty)
- [ ] Achievement modal (empty)

### Design System Components (Tamagui)
- [ ] `Button` variants (primary, secondary, ghost)
- [ ] `Card` wrapper with shadow/border
- [ ] `ProgressBar` (animated)
- [ ] `Badge` (level tier, achievement)
- [ ] `CategoryChip` (horizontal scroll picker)
- [ ] `XPBar` (with animated fill)
- [ ] `StatChip` (icon + value + label)
- [ ] `Sheet` (bottom sheet modal wrapper)

---

## Sprint 2 – Data Layer & AI Generation (Week 3)

### Local Data Stores (Zustand + AsyncStorage)
- [ ] `user.store.ts` – profile, XP, streak, level
- [ ] `lists.store.ts` – vocab lists + word progress
- [ ] `sessions.store.ts` – session history
- [ ] `game.store.ts` – achievements, badges
- [ ] `settings.store.ts` – notifications, language
- [ ] `_persist()` + `_hydrate()` on app start

### AI List Generation
- [ ] Supabase Edge Function: `/generate-vocab-list` (Deno)
  - [ ] Prompt construction (system + user)
  - [ ] OpenAI / Gemini API call
  - [ ] Zod response validation
  - [ ] Error handling + logging
- [ ] `services/ai/generateList()` (client-side)
- [ ] `services/ai/parseLLMResponse()` (Zod schema)
- [ ] Create List screen: full form UI
  - [ ] Topic input + validation
  - [ ] Category picker (CategoryChip)
  - [ ] Description textarea
  - [ ] Word count selector
  - [ ] Language picker
  - [ ] Loading state (animated)
  - [ ] Success → navigate to List Detail

### List Management
- [ ] Home screen: My Lists grid with ListCard
- [ ] List Detail screen: word list + stats
- [ ] Delete list (with confirmation)
- [ ] Empty states (no lists, generating)

---

## Sprint 3 – Learning Engine (Week 4–5)

### Flashcard Mode
- [ ] `FlashCard` component with `rotateY` flip animation (Reanimated)
- [ ] Session state machine (word cycling, known/unknown tracking)
- [ ] "I knew it" / "Didn't know" buttons
- [ ] Session completion → trigger XP award
- [ ] Session Summary screen
- [ ] `updateWordProgress()` in lists.store

### Quiz Mode
- [ ] Multiple choice question generator (1 correct + 3 distractors)
- [ ] Fill-in-the-blank question generator
- [ ] Quiz session flow (N questions)
- [ ] Immediate answer feedback UI (✅/❌)
- [ ] Score calculation + Session Summary screen
- [ ] Quiz-mode paywall gate for free users

### Explore Screen
- [ ] `constants/predefined-lists.ts` (10 lists × 2 languages)
- [ ] Category filter chips (horizontal scroll)
- [ ] ExploreListCard (gradient cover, metadata)
- [ ] "Add to Library" action + +5 XP animation
- [ ] "Already in library" state

---

## Sprint 4 – Gamification & Stats (Week 6)

### XP & Leveling
- [x] `constants/levels.ts` (XP thresholds per level)
- [x] `awardXP()` function in user.store
- [x] Level-up detection + celebration modal
- [x] XPBar component in Profile + Session Summary
- [x] Level badge in Profile header

### Streaks
- [x] Daily streak calculation (compare `lastStudiedAt` to today)
- [x] Streak display on Home + Profile
- [x] Streak milestone bonus XP

### Achievements
- [x] `constants/achievements.ts` (14 achievement definitions)
- [x] `checkAchievements()` called after each XP award
- [x] Achievement unlock modal (slide-up)
- [x] Profile: Recent Achievements section
- [x] All Achievements screen (grid with locked/unlocked state)

### Stats Screen
- [x] Daily / Weekly / Monthly tabs (Today / This Week / All Time)
- [x] Session history aggregation from local store
- [x] Session breakdown (flashcard vs quiz ratio)
- [x] XP + streak + total progress section
- [x] Recent sessions list

### List Management
- [x] List Detail screen: word list + progress stats + delete
- [x] Create Custom List screen (manual entry: name, topic, category, words, optional example sentence per word)
- [x] Home screen: list cards clickable → detail; plus button → create

---

## Sprint 5 – Onboarding + Paywall + Notifications (Week 7)

### Onboarding
- [x] Step 1: Welcome + Name input (optional)
- [x] Step 2: Purpose selector + push notification pre-prompt (value-framed)
- [x] Step 3: Topic input + category chips + word count selector + list language + optional description
- [x] Step 4: Loading (Phase A: animation + micro-copy + fun fact) → List Preview (Phase B: first 5 words + blurred remaining)
- [x] App language auto-detected from device locale (no language step in onboarding)
- [x] Progress dots indicator (4 steps)
- [x] Resumable onboarding (pick up where user left off on reopen)

### Paywall
- [x] RevenueCat offerings fetch + display (runtime prices, no hardcoded values)
- [x] Custom paywall screen (`app/paywall.tsx`)
- [x] Personalized headline using user's topic + name (paywall.headlineTopic)
- [x] Personalized subtitle with word count + topic (paywall.subtitleTopic)
- [x] Annual plan pre-selected by default
- [x] `useEntitlement` hook integration across gated features
- [x] Lapsed subscriber paywall (`app/(modals)/paywall.tsx`)
- [x] Restore Purchase functionality

### Notifications
- [x] Expo Notifications permission request (Step 2, with value-framing pre-prompt)
- [x] `scheduleReminders()` on onboarding complete
- [x] Morning / Afternoon / Evening / Night slots (settings UI)
- [x] Streak protection notification (conditional on streak ≥ 3)
- [x] Notification settings screen (toggles + time picker)
- [x] `cancelAllNotifications()` on toggle off
- [x] Re-engagement notification for users who abandon mid-onboarding (24h delay)

---

## Sprint 6 – Polish, QA & Submission (Week 8)

### Polish
- [ ] All animations smooth (60fps check)
- [x] Empty states for all screens
- [x] Error states (network, AI fail, RC fail)
- [x] Loading skeletons (Home screen: animated skeleton cards while Zustand store hydrates from AsyncStorage)
- [x] Haptic feedback on key actions (level up, achievement, flashcard answers, quiz answers)
- [ ] App icon + splash screen final assets
- [x] Dark mode safe (hardcoded `#FFFFFF`/`#0D0D0D` replaced with `$background`/`$color`/`$gray3`/`$borderColor` tokens across all screens)

### QA
- [ ] Manual test: Onboarding → Paywall → Home full flow
- [x] Manual test: Create list → Flashcards → Quiz → Stats update
- [x] Manual test: Explore → Add → Study
- [x] Manual test: Achieve achievements → Level up
- [ ] Manual test: Notification schedule
- [x] Manual test: Language switch (TR ↔ EN)
- [ ] Crashlytics test crash
- [ ] RevenueCat sandbox purchase test
- [ ] Remote Config fetch test
- [x] Amplitude event validation (session_completed, explore_list_added, onboarding_completed, etc.)

### App Store Submission
- [ ] Screenshots (6.7", 6.1", iPad)
- [ ] App Store description (EN + TR)
- [ ] Keywords research (ASO)
- [ ] Privacy Policy URL
- [ ] Age rating questionnaire
- [ ] TestFlight internal build → external beta
- [ ] App Store submission

---

## Post-MVP Backlog (v1.1+)

| Feature | Priority | Sprint |
|---------|----------|--------|
| Supabase sync (sign-in to sync) | High | v1.1 |
| Dark mode | Medium | v1.1 → **Done (Sprint 6)** |
| SM-2 spaced repetition | High | v1.2 |
| AI list extension | Medium | v1.2 |
| AppsFlyer attribution | High (if paid UA) | v1.2 |
| Word pronunciation audio | Low | v2.0 |
| Community shared lists | Low | v2.0 |
| Additional languages | Medium | v2.0 |

---

## Bug Fixes & Improvements Log

### Dark Mode & Polish Pass (March 2026)

#### Dark Mode Fixes
- **Hardcoded white/dark backgrounds removed** – All screens now use Tamagui semantic tokens (`$background`, `$gray3`, `$borderColor`, `$color`, `$colorSubtitle`) instead of hardcoded hex values. Affected files: `index.tsx`, `explore.tsx`, `stats.tsx`, `profile.tsx`, `settings/index.tsx`, `achievements.tsx`, `list/create.tsx`, `session/flashcard.tsx`.
- **TextInput colours in Create List** – Uses `useColorScheme()` to pick appropriate text/placeholder colours in dark mode.
- **Flashcard card background** – `Animated.View` now uses `useTheme().background.val` instead of hardcoded `"#fff"` so card surfaces adapt to dark mode.

#### Loading Skeletons
- **`Skeleton` component** added at `components/DesignSystem/Skeleton/index.tsx` – animated pulse (opacity oscillation), uses `theme.gray5` for background colour.
- **Home screen skeleton** – Shows 3 `ListCardSkeleton` placeholder cards while the `listsStore` is hydrating from AsyncStorage.
- **`_hasHydrated` in `listsStore`** – `onRehydrateStorage` callback sets `_hasHydrated: true` once Zustand persist finishes loading. The Home screen gates on this flag.

#### RevenueCat Offerings
- Offerings are already fetched at runtime via `useSubscription()` hook (both `app/paywall.tsx` and `app/(modals)/paywall.tsx` display `pkg.product.priceString`). Marked as `[x]` in roadmap.

#### Bug / Warning Fixes
- **Unused variable `stats`** in `app/(tabs)/stats.tsx` – removed from destructure.
- **Unused variable `router`** in `app/achievements.tsx` – removed import and declaration.

#### Roadmap Update
- `[ ] RevenueCat offerings fetch` → `[x]`
- `[ ] Loading skeletons` → `[x]`
- `[ ] Dark mode safe` → `[x]`


#### Bug Fixes
- **`wordsMastered` stat never incremented** – `flashcard.tsx` and `quiz.tsx` now compare mastered-word counts before and after each session and call `incrementStat("wordsMastered", newlyMastered)`. This unblocks the `words_50`, `words_200`, and `words_500` achievements.

#### Learning Process Improvements
- **Example sentence field in Create List** – Word entries in the manual create-list screen now include an optional example sentence (`createList.example` / `createList.examplePlaceholder` i18n keys added for EN + TR). The example is stored on `VocabWord.example` and displayed on flashcard back-face and quiz answer reveal.

#### Test Coverage
- Added `__tests__/predefinedLists.test.ts` – 16 tests covering `LIST_CATEGORIES`, `PREDEFINED_LISTS_EN`, `PREDEFINED_LISTS_TR`, and `getPredefinedListsByLocale`.
- Added `__tests__/listsStoreExtended.test.ts` – 14 tests covering word status edge cases (learning → learned transition, mastery persistence) and `wordsMastered` stat integration with `gameStore`.
- Total unit tests: **126** (up from 93).

### Error States Pass (March 2026)

#### RC (RevenueCat) Error Handling
- **Purchase error feedback** – Both `app/paywall.tsx` and `app/(modals)/paywall.tsx` now show an `Alert.alert()` when a purchase fails with an actual error (user cancellation is still silently ignored by checking `err.userCancelled`). Analytics event `paywall_purchase_failed` / `lapsed_paywall_purchase_failed` fired on error.
- **Restore error feedback** – Both paywall screens now show an `Alert.alert()` when restore fails or when no active subscriptions were found after restore.
- **Offerings fetch error** – `useSubscription` hook now exposes `offeringsError: boolean` and `refetch()`. Both paywall screens show an `ErrorState` component with a **Retry** button when offerings fail to load (network error scenario).

#### New Components
- **`ErrorState` component** added at `components/DesignSystem/ErrorState/index.tsx` – reusable full-screen error state with emoji, title, subtitle, and optional retry button. Follows the same design system patterns as `Skeleton` and `StatChip`.

#### i18n Additions (EN + TR)
- `common.tryAgain`, `error.retry`, `error.network.title`, `error.network.subtitle`, `error.generic.title`, `error.generic.subtitle`
- `paywall.purchaseErrorTitle`, `paywall.purchaseError`, `paywall.restoreErrorTitle`, `paywall.restoreError`, `paywall.restoreSuccessTitle`, `paywall.restoreSuccess`, `paywall.offeringsErrorTitle`, `paywall.offeringsError`

#### Roadmap Update
- `[ ] Error states (network, AI fail, RC fail)` → `[x]`
