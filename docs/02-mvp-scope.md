# VocabifyX – MVP Scope

> **Version:** 1.0 (Store Launch)  
> **Reference:** [Product Vision](./01-product-vision.md) · [Roadmap](./16-development-roadmap.md)

---

## ✅ IN SCOPE – MVP v1.0

### Core Feature: AI Vocabulary List Generation
- Word/topic input field ("germany travel", "economy", "machine learning")
- Topic picker with predefined categories (Travel, Economy, Tech, Health, etc.) — user can also type custom topic
- Optional description field (300–500 chars) for context accuracy
- Word count selector: 15 / 30 / 50 words
- List language selector: **default = device locale**, full dropdown of all supported languages (EN, TR, DE, FR, ES, IT, PT, NL, RU, JA, ZH, AR…)
- AI generates the `term` field in the selected language, `translation` in user's native language
- AI call → structured keyword list → saved locally

### Learning Engine
- **Flashcard mode** – tap to flip, mark as known/unknown
- **Quiz mode** – multiple choice (4 options), fill-in-the-blank
- Session completion screen with XP earned summary

### Gamification
- XP per correct answer / session completion
- Levels (Bronze → Silver → Gold → Platinum → Diamond → Legend)
- Achievement badges (Newbie, First List, 7-Day Streak, Vocab Master, etc.)
- Streak counter (daily study streak)

### Explore Section
- 5–10 predefined lists per app language (TR / EN)
- User can preview a list and "Add to My Library" with one tap
- Categories: Everyday English, Travel Basics, Economy 101, Tech Terms, Health & Body, etc.

### Stats & Progress
- Per-list: words learned %, quiz score history, time spent
- Global: total XP, current level, streak, achievements unlocked, total words mastered

### Onboarding
- 4-step onboarding: name, native language, learning goals, first list creation
- App language auto-detected from device locale (no step needed)
- User creates and **sees their first list** during onboarding before any paywall
- Hard paywall (no skip) requires starting free trial to enter the app

### Monetization
- **Hard paywall only — no free tier**
- Free trial (duration set via Firebase Remote Config) then subscription via RevenueCat
- Plans: Weekly / Monthly / Annual (set in App Store Connect, no prices in code)
- Custom paywall UI (no third-party paywall SDK)

### Notifications
- 3–4 local notifications per day in smart time windows
- Study reminders, streak protection, achievement unlock

### Settings
- App language switcher (TR / EN)
- Notification settings
- Sign In to Sync (Google / Apple) – optional
- Theme: Light (dark mode post-MVP)

### Analytics & Observability
- Amplitude: core event tracking (see doc 12)
- Firebase Remote Config: feature flags, AB test paywall copy
- Firebase Crashlytics: crash reporting

---

## ❌ OUT OF SCOPE – MVP v1.0

| Feature | Reason | Post-MVP Target |
|---------|---------|-----------------|
| Supabase cloud sync | Local-first MVP; add sync in v1.1 | v1.1 |
| Dark mode | Nice-to-have, not critical | v1.1 |
| AppsFlyer attribution | Add after validating retention | v1.2 |
| Community / shared lists | Complex, needs backend moderation | v2.0 |
| AI list extension (auto suggest) | Adds complexity | v1.2 |
| Additional languages (ES, DE…) | Expand after TR/EN validated | v2.0 |
| Adaptive SM-2 spaced repetition | Standard intervals first | v1.2 |
| Offline full sync | Local storage covers MVP | v1.1 |
| Social features / leaderboards | Post-market fit | v2.0 |
| Pronunciation audio | Nice-to-have | v1.2 |

---

## 🚧 MVP Architecture Constraint

**Local-first, no mandatory login**  
User data lives in AsyncStorage / local SQLite. Supabase tables and schema are designed so sync can be added without breaking changes in v1.1. Auth is optional ("Sign in to sync" in Settings).

---

## Success Criteria for MVP

- Build time: ≤ 8 weeks
- Store rating: ≥ 4.2 at 100 ratings
- Day-1 retention: ≥ 40%
- Day-7 retention: ≥ 30%
- Trial start rate: ≥ 60% (of users who complete onboarding)
- Trial-to-paid conversion: ≥ 20%
