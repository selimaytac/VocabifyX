# VocabifyX – Smart Vocabulary · Docs Index

> **App Name:** VocabifyX – Smart Vocabulary  
> **Platform:** iOS (primary) / Android  
> **Stack:** Expo (React Native) · Tamagui · Supabase · RevenueCat · Amplitude · Firebase  
> **Goal:** Ship a fast MVP to the App Store, then iterate. AI-generated vocabulary lists + spaced-repetition learning.

---

## 📁 Document Map

| # | Document | Description |
|---|----------|-------------|
| 1 | [01-product-vision.md](./01-product-vision.md) | Why the app exists, core value prop, target audience |
| 2 | [02-mvp-scope.md](./02-mvp-scope.md) | What's IN and OUT for MVP v1.0 |
| 3 | [03-app-architecture.md](./03-app-architecture.md) | Tech stack decisions, data flow, module overview |
| 4 | [04-features.md](./04-features.md) | Feature-by-feature breakdown with acceptance criteria |
| 5 | [05-ai-list-generation.md](./05-ai-list-generation.md) | AI prompt strategy, model choice, list generation pipeline |
| 6 | [06-learning-engine.md](./06-learning-engine.md) | Flashcards, quizzes, spaced-repetition, session logic |
| 7 | [07-gamification.md](./07-gamification.md) | XP, levels, achievements, streaks, badges |
| 8 | [08-explore.md](./08-explore.md) | Predefined lists, categories, copy-to-library flow |
| 9 | [09-onboarding.md](./09-onboarding.md) | Onboarding screens, data collection, hard paywall trigger |
| 9b | [09b-onboarding-research.md](./09b-onboarding-research.md) | Research analysis: NNG, VWO, Adapty — insights applied to onboarding |
| 10 | [10-monetization.md](./10-monetization.md) | RevenueCat, plans, paywall, free trial strategy |
| 11 | [11-notifications.md](./11-notifications.md) | Local notification schedule, copy, frequency rules |
| 12 | [12-analytics.md](./12-analytics.md) | Amplitude events, Firebase Remote Config, Crashlytics |
| 13 | [13-data-model.md](./13-data-model.md) | Supabase schema, local-first sync strategy, offline approach |
| 14 | [14-ui-design-system.md](./14-ui-design-system.md) | Colour palette, typography, component patterns |
| 15 | [15-localization.md](./15-localization.md) | TR / EN i18n strategy with Lingui |
| 16 | [16-development-roadmap.md](./16-development-roadmap.md) | Sprint-by-sprint implementation plan |

---

## 🔑 Quick Decisions Summary

| Topic | Decision |
|-------|----------|
| Languages | Turkish (TR) & English (EN) – UI and list languages |
| AI Backend | Prompt-based, configurable model (OpenAI / Gemini via edge function) |
| Database | Supabase (local-first MVP, sync added in v1.1) |
| Auth | Apple Sign In + Google Sign In (optional – "Sign in to sync") |
| Paywall | Hard paywall after onboarding — no free tier (RevenueCat, custom native UI) |
| Analytics | Amplitude (events) + Firebase (Remote Config, Crashlytics) |
| Notifications | Local only, max 3-4/day in smart time windows |
| Monetization | Subscription (weekly / monthly / annual), no prices in app code |
