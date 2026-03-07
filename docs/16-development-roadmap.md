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
- [ ] Level-up detection + celebration modal
- [x] XPBar component in Profile + Session Summary
- [x] Level badge in Profile header

### Streaks
- [x] Daily streak calculation (compare `lastStudiedAt` to today)
- [x] Streak display on Home + Profile
- [ ] Streak milestone bonus XP

### Achievements
- [x] `constants/achievements.ts` (14 achievement definitions)
- [x] `checkAchievements()` called after each XP award
- [ ] Achievement unlock modal (slide-up)
- [x] Profile: Recent Achievements section
- [ ] All Achievements screen (grid with locked/unlocked state)

### Stats Screen
- [x] Daily / Weekly / Monthly tabs (Today / This Week / All Time)
- [x] Session history aggregation from local store
- [x] Session breakdown (flashcard vs quiz ratio)
- [x] XP + streak + total progress section
- [x] Recent sessions list

### List Management
- [x] List Detail screen: word list + progress stats + delete
- [x] Create Custom List screen (manual entry: name, topic, category, words)
- [x] Home screen: list cards clickable → detail; plus button → create

---

## Sprint 5 – Onboarding + Paywall + Notifications (Week 7)

### Onboarding
- [x] Step 1: Welcome + Name input (optional)
- [x] Step 2: Language selector (EN / TR) with locale switching
- [x] Step 3: First list picker (category filter + predefined lists)
- [x] Step 4: All Set screen
- [ ] Step 3b: AI generation loading → list preview (requires Supabase Edge Function)
- [ ] Paywall screen (hard gate – requires RevenueCat)
- [x] Progress dots indicator (4 steps)
- [ ] Resumable onboarding (pick up where user left off on reopen)

### Paywall
- [ ] RevenueCat offerings fetch + display (runtime prices, no hardcoded values)
- [ ] Custom paywall screen (`app/onboarding/paywall.tsx`)
- [ ] Personalized headline using user's topic + name
- [ ] Annual plan pre-selected by default
- [ ] `useEntitlement` hook integration across gated features
- [ ] Lapsed subscriber paywall (`app/(modals)/paywall.tsx`)
- [ ] Restore Purchase functionality

### Notifications
- [ ] Expo Notifications permission request (Step 2, with value-framing pre-prompt)
- [ ] `scheduleReminders()` on onboarding complete
- [x] Morning / Afternoon / Evening / Night slots (settings UI)
- [ ] Streak protection notification (conditional on streak ≥ 3)
- [x] Notification settings screen (toggles + time picker)
- [ ] `cancelAllNotifications()` on toggle off
- [ ] Re-engagement notification for users who abandon mid-onboarding (24h delay)

---

## Sprint 6 – Polish, QA & Submission (Week 8)

### Polish
- [ ] All animations smooth (60fps check)
- [x] Empty states for all screens
- [ ] Error states (network, AI fail, RC fail)
- [ ] Loading skeletons
- [ ] Haptic feedback on key actions (level up, achievement)
- [ ] App icon + splash screen final assets
- [ ] Dark mode safe (avoid hardcoded white bg)

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
| Dark mode | Medium | v1.1 |
| SM-2 spaced repetition | High | v1.2 |
| AI list extension | Medium | v1.2 |
| AppsFlyer attribution | High (if paid UA) | v1.2 |
| Word pronunciation audio | Low | v2.0 |
| Community shared lists | Low | v2.0 |
| Additional languages | Medium | v2.0 |
