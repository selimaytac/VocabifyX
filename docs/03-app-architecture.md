# VocabifyX – App Architecture

> **Reference:** [MVP Scope](./02-mvp-scope.md) · [Data Model](./13-data-model.md)

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Expo (React Native) ~55.0 | Managed workflow |
| Navigation | expo-router (file-based) | Tab + Stack navigation |
| UI Library | Tamagui | Design system, tokens, animations |
| State Management | Zustand | Lightweight global stores |
| Server State | TanStack React Query | Data fetching & caching |
| Local Storage | AsyncStorage + MMKV (future) | Offline-first persistence |
| Backend / DB | Supabase | Auth (optional), DB (v1.1), Edge Functions (AI calls) |
| AI Calls | Supabase Edge Functions | Proxy to OpenAI / Gemini |
| Payments | RevenueCat (`react-native-purchases`) | Subscriptions & paywall |
| Paywall UI | Custom (`app/onboarding/paywall.tsx`) | Native paywall screen, copy controlled via Firebase Remote Config |
| Analytics | Amplitude | User event tracking |
| Remote Config | Firebase Remote Config | Feature flags, copy variants |
| Crash Reporting | Firebase Crashlytics | |
| Notifications | Expo Notifications | Local only (MVP) |
| i18n | Lingui | TR / EN message catalogues |
| Forms / Validation | Zod | Schema validation |
| Attribution | — (post-MVP: AppsFlyer) | |

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VocabifyX App (Expo)                    │
│                                                             │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Home /  │  │  Explore  │  │  Stats /  │  │ Profile  │  │
│  │  Lists   │  │           │  │ Activity  │  │ Settings │  │
│  └──────────┘  └───────────┘  └───────────┘  └──────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Core Services & Stores                  │   │
│  │  ListStore │ UserStore │ GameStore │ SettingsStore   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Local Persistence (AsyncStorage)          │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
      ┌───────▼──────┐ ┌───────▼──────┐ ┌──────▼───────┐
      │   Supabase   │ │  RevenueCat  │ │  Firebase    │
      │ Edge Fn (AI) │ │  Purchases   │ │  RC + Crash  │
      │ Auth (v1.1)  │ │              │ │              │
      │ DB (v1.1)    │ │              │ │              │
      └──────────────┘ └──────────────┘ └──────────────┘
```

---

## Module Structure (File System)

```
app/
  (tabs)/
    index.tsx          ← Home (My Lists)
    explore.tsx        ← Explore predefined lists
    stats.tsx          ← Activity & Stats  
    profile.tsx        ← Profile & Settings
  (modals)/
    create-list.tsx    ← AI list generation flow
    list-detail/[id].tsx
    flashcard/[id].tsx
    quiz/[id].tsx
    achievement.tsx
    paywall.tsx
  onboarding/
    _layout.tsx
    step-1.tsx → step-5.tsx
    paywall.tsx

components/
  lists/               ← ListCard, WordCard, WordList
  learning/            ← FlashCard, QuizQuestion, SessionComplete
  gamification/        ← XPBar, LevelBadge, AchievementCard
  explore/             ← ExploreCategoryCard, ExploreListCard
  stats/               ← StatCard, ProgressRing, ActivityChart
  ui/                  ← Button, Input, Sheet, Badge (Tamagui-based)

services/
  ai/                  ← generateList(), parseLLMResponse()
  amplitude/           ← track(), identify()
  firebase/            ← remoteConfig(), logCrash()
  notifications/       ← scheduleReminders(), cancelAll()
  revenuecat/          ← checkEntitlement(), purchasePackage()
  supabase/            ← client, auth (v1.1)

store/
  lists.store.ts       ← Vocabulary lists, words, progress
  user.store.ts        ← User profile, XP, level, streak
  game.store.ts        ← Achievements, badges
  settings.store.ts    ← App language, notification prefs

hooks/
  useEntitlement.ts    ← RevenueCat premium check
  useRemoteConfig.ts   ← Firebase feature flags

locales/
  en/messages.po
  tr/messages.po

constants/
  levels.ts            ← XP thresholds per level
  achievements.ts      ← Achievement definitions
  predefined-lists.ts  ← Explore section lists (TR + EN)
  topics.ts            ← Topic categories
```

---

## Data Flow: AI List Generation

```
User Input
  → topic (string)
  → topicCategory (enum)
  → description? (string)
  → wordCount (15|30|50)
  → listLanguage (TR|EN)
      │
      ▼
services/ai/generateList()
  → builds system prompt + user prompt
  → POST to Supabase Edge Function /generate-vocab-list
      │
      ▼
Edge Function (Deno)
  → validates request
  → calls OpenAI / Gemini API
  → returns { words: [{term, translation, example, difficulty}] }
      │
      ▼
services/ai/parseLLMResponse()
  → validates response schema (Zod)
  → returns VocabList object
      │
      ▼
store/lists.store.ts
  → saves to AsyncStorage
  → updates UI
```

---

## Navigation Structure

```
Root
├── Onboarding Stack (shown on first launch)
│   ├── step-1 (name)
│   ├── step-2 (native language + push permission)
│   ├── step-3 (topic / list creation)
│   ├── step-4 (loading → list preview)
│   └── paywall (hard paywall — no skip)
│
└── Main Tabs (after onboarding)
    ├── Home (My Lists + Today's session)
    ├── Explore (predefined lists)
    ├── + FAB → Create List Modal
    ├── Stats (Activity & Progress)
    └── Profile (achievements, settings)
```

---

## Key Architectural Decisions

### Local-First (MVP)
All user data persists locally via AsyncStorage. No login required to use the app. "Sign in to Sync" (Supabase Auth) is a Settings option that enables cloud backup — scheduled for v1.1.

### Supabase Edge Functions for AI
AI API keys live in Supabase Edge Functions (Deno), never in the client app. This allows swapping models (OpenAI → Gemini → Claude) without an app update, and prevents key exposure.

### RevenueCat Abstraction
All subscription logic goes through `services/revenuecat/`. No raw StoreKit/Billing API calls in feature code. `useEntitlement()` hook is the single source of truth for premium access.

### Firebase Remote Config
Paywall copy, word count options, free trial duration, and feature availability are controlled via Remote Config. This allows A/B testing without app updates.
