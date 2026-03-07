# MVP Project Specification

> **How to use:** Fill in every `<!-- answer -->` block, then hand this document to your AI coding assistant as the project brief. Keep answers concise — one or two sentences per question is enough.

---

## 1. Project Snapshot

| Field | Answer |
|---|---|
| **App name** | `<!-- e.g. FocusFlow -->` |
| **Platforms** | `<!-- iOS / Android / Both -->` |
| **One-line pitch** | `<!-- What it does and for whom -->` |
| **Target launch** | `<!-- YYYY-MM-DD -->` |
| **Max build time** | `<!-- e.g. 8 weeks -->` |
| **Author** | `<!-- @github-handle -->` |

---

## 2. Problem & Hypothesis

**What is the core problem you are solving?**
```
<!-- Be specific. Vague problems produce vague products. -->
```

**Who has this problem?** *(age range, geography, device, behaviour)*
```
<!-- e.g. 22–35 iPhone users who start new habits but lose consistency after week 1 -->
```

**Why do existing solutions fall short?**
```
<!-- e.g. Competitors are too complex / expensive / missing X -->
```

**Core hypothesis** *(complete the sentence)*
```
We believe [target user] will [do this action] because [reason].
We'll know it's working when [measurable outcome].
```

**Main competitors and your differentiator**

| Competitor | Weakness | Your edge |
|---|---|---|
| `<!-- App A -->` | `<!-- e.g. Poor UX, 2.8★ -->` | `<!-- e.g. Simpler 30-second daily check-in -->` |
| `<!-- App B -->` | | |

---

## 3. MVP Features

> **Rule:** If a feature does not directly test the hypothesis, it does not ship in the MVP.

### Must build (P0)

| # | Feature | What it does | Effort (S/M/L) |
|---|---|---|---|
| 1 | Onboarding | Personalise experience; explain value | S |
| 2 | Auth | Sign up / sign in (Apple + email) | S |
| 3 | `<!-- Core feature -->` | `<!-- e.g. Create and track a daily habit -->` | M |
| 4 | Paywall | Subscription screen; gate premium features | M |
| 5 | Push notifications | Re-engage users at the right moment | S |
| 6 | Settings / profile | Manage account; notification prefs | S |

### Not building in MVP (explicitly deferred)

| Feature | Reason |
|---|---|
| `<!-- e.g. Social / sharing -->` | `<!-- Adds scope; not core hypothesis -->` |
| `<!-- e.g. Web dashboard -->` | `<!-- Separate product; post-validation -->` |
| `<!-- e.g. Gamification / badges -->` | `<!-- Nice-to-have; validate core loop first -->` |

### User flow

```
Splash → Onboarding → Sign Up/In → Home
                                     ↓
                               [Core Feature]
                                     ↓
                            Paywall (if gated)
```

*Replace with Figma link once designs exist:* `<!-- https://figma.com/... -->`

---

## 4. Screens

List every screen that needs to be built.

```
<!-- e.g.
- SplashScreen
- OnboardingScreen (3 slides)
- SignUpScreen / SignInScreen
- HomeScreen
- CoreFeatureScreen
- PaywallScreen
- SettingsScreen
- ProfileScreen
-->
```

---

## 5. Data Model

List the main database tables and their key columns.

```sql
-- Example
users        (id, email, created_at, subscription_status)
habits       (id, user_id, title, frequency, created_at)
habit_logs   (id, habit_id, completed_at)
```

*Supabase project ID:* `<!-- YOUR_PROJECT_ID -->`

---

## 6. Tech Stack

### Pre-configured in this template

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (~55) |
| Navigation | Expo Router (~55, file-based, typed routes) |
| UI | Tamagui |
| Global state | Zustand |
| Server state | TanStack Query |
| Schema validation | Zod |
| i18n | LinguiJS |
| Animations | React Native Reanimated |
| IAP / Subscriptions | RevenueCat |
| Paywall UI | Superwall |
| Analytics | Amplitude |
| Attribution | Adjust |

### Fill in for this project

| Service | Choice | Notes |
|---|---|---|
| Database | `<!-- e.g. Supabase -->` | |
| Auth | `<!-- e.g. Supabase Auth + Apple Sign-In -->` | |
| File storage | `<!-- e.g. Supabase Storage -->` | |
| Push notifications | `<!-- e.g. Expo Notifications / OneSignal -->` | |
| Crash reporting | `<!-- e.g. Sentry -->` | |
| Edge functions / API | `<!-- e.g. Supabase Edge Functions -->` | |
| CI / CD | `<!-- e.g. GitHub Actions + EAS Build -->` | |

---

## 7. Non-Functional Requirements

**Performance targets**
- Cold start: < 2 s (measure on mid-range Android)
- JS bundle: < 3 MB gzipped
- API response: < 500 ms p95 response time

**Security requirements**
- No secrets in source code — use `.env` (see `.env.example`)
- RLS enabled on all Supabase tables
- Sensitive tokens in secure storage, not AsyncStorage
- GDPR / CCPA: privacy policy and data deletion flow required

**Platform limits to respect**
- iOS: digital goods must use Apple IAP (App Store guideline 3.1.1)
- Both: do not rely solely on push for retention (opt-in rate ≈ 40–60%)

**What NOT to build in the MVP**
- ❌ Custom backend — use Supabase until > 1 k active users
- ❌ Admin dashboard — not user value
- ❌ Full offline sync — optimistic UI + basic cache is enough
- ❌ Multiple subscription tiers — start with one plan

---

## 8. Success Metrics

| Metric | Target (30 days post-launch) |
|---|---|
| Downloads | `<!-- e.g. 500 -->` |
| Day 1 retention | `<!-- e.g. ≥ 40% -->` |
| Day 7 retention | `<!-- e.g. ≥ 20% -->` |
| Core action completion | `<!-- e.g. ≥ 60% complete first action -->` |
| Paywall conversion | `<!-- e.g. ≥ 3% -->` |
| Crash-free sessions | ≥ 99.5% |

**Go / No-Go:** `<!-- e.g. Continue if D7 retention ≥ 15% AND conversion ≥ 2%; pivot otherwise -->`

---

## 9. Target Audience

| Dimension | Answer |
|---|---|
| Age | `<!-- e.g. 22–35 -->` |
| Geography | `<!-- e.g. US, UK, CA, AU -->` |
| Primary device | `<!-- e.g. iPhone -->` |
| Core motivation | `<!-- e.g. Build consistent habits -->` |
| Core pain point | `<!-- e.g. Loses consistency after week 1 -->` |
| Willingness to pay | `<!-- e.g. Yes — already uses 2+ paid apps -->` |

---

## 10. Marketing

### Positioning

```
For [target user] who [problem],
[App Name] is a [category] that [key benefit].
Unlike [competitor], we [differentiator].
```

### App name options *(iOS limit: 30 chars for name + subtitle)*

| Name | Chars | .com free | Handle free |
|---|---|---|---|
| `<!-- Primary -->` | | `[ ]` | `[ ]` |
| `<!-- Alt 1 -->` | | `[ ]` | `[ ]` |
| `<!-- Alt 2 -->` | | `[ ]` | `[ ]` |

**Subtitle (30 chars max):** `<!-- e.g. Build Habits That Stick -->`

### ASO keywords *(iOS — 100 chars, comma-separated, no spaces)*

```
<!-- e.g. habit,tracker,routine,daily,streak,productivity,goals,morning,self,improvement -->
```

### Launch channels (pick 2–3 for MVP)

- [ ] App Store organic (ASO) — always on
- [ ] Product Hunt — launch day
- [ ] Reddit (r/SideProject, r/IndieHackers, niche subs)
- [ ] TikTok / Instagram Reels — short demos
- [ ] Apple Search Ads — post-validation only

---

## 11. Launch Checklist

### Before first commit
- [ ] This spec document is complete and reviewed
- [ ] `.env.example` updated with all required keys
- [ ] Supabase project created; RLS policies written
- [ ] Figma designs exist for all P0 screens

### Before TestFlight / beta
- [ ] All P0 features working end-to-end on iOS and Android
- [ ] Analytics events firing for every core user action
- [ ] Crash reporting integrated and receiving events
- [ ] Paywall flow tested with sandbox accounts
- [ ] Error, loading, and empty states on every screen

### Before App Store submission
- [ ] Privacy policy URL live
- [ ] Terms of service URL live
- [ ] App Store data safety form completed
- [ ] Screenshots for all required device sizes
- [ ] Crash-free rate ≥ 99% in beta
- [ ] App Store listing copy, keywords, and subtitle set

---

*Last updated: <!-- YYYY-MM-DD --> | Version: 0.1.0*
