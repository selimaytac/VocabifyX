# VocabifyX – Onboarding

> **Research backing:** [09b-onboarding-research.md](./09b-onboarding-research.md)  
> **Reference:** [Monetization](./10-monetization.md) · [Analytics](./12-analytics.md) · [AI Generation](./05-ai-list-generation.md)

---

## Philosophy

> "Help people accomplish something as soon as they start your app, letting them be successful before you request additional information." — Apple HIG

Three research-backed principles guide our onboarding:

1. **Post-value paywall** — Users see their completed list before any payment screen (Speechify / Calm model). By then, they have something they want — and we're gating it.
2. **Every question collects data we actually use** — Nothing decorative. Each step directly powers the AI generation or gamification (NNG principle: onboarding is only justified when app can't function without the data).
3. **Minimize cognitive load** — One question per screen, fast transitions, visual choices over text inputs where possible (VWO: simplify steps, NNG: don't strain memory).

**There is no free tier. The paywall is mandatory and has no close button.**

---

## App Language Detection

App language is **automatically detected from device locale** at first launch.
- Device locale `tr-*` → Turkish
- Everything else → English

No language selection step in onboarding. The user can change the app language at any time in **Settings → Language**. This keeps onboarding shorter and removes a decision that adds no value — the user is here to master vocabulary for a topic, not to configure a UI language.

---

## Onboarding Flow

VocabifyX is a **general vocabulary specialization tool**. Users can master vocabulary for any topic or domain (biology, software, travel, finance, greetings…) in any language they choose. Onboarding collects the minimum data needed to personalise their first list.

### Progress Indicator
All screens show: `● ● ○ ○` dots + "Step 2 of 4" text at the top. This reassures users they're not in an infinite flow (VWO: reinforce progress).

---

### Step 1 – Welcome + Name

```
Visual:
  Full-screen gradient (brand purple → deeper purple)
  Logo mark + "VocabifyX" wordmark

  "Let's build your vocabulary. 🚀"
  Subtitle: "Tell us your name to get started."

  [ Text input: "Your name..." ]

  [ Continue → ]

Notes:
  - Optional. If blank, defaults to "Learner".
  - Keyboard opens automatically.
  - No password, no email, no friction.
  - Single CTA, no skip link needed.
  - No language selection — app language auto-detected from device.
```

**Data collected:** `displayName`  
**Research basis:** NNG — minimize sign-up friction at start; Apple HIG — don't gate with account creation upfront.

---

### Step 2 – Purpose + Push Permission

```
Visual:
  Clean screen
  "Why are you here?"
  Subtitle: "We'll tailor your vocabulary to your specific goals."

  [ 💼 Work & Career      ]
  [ ✈️  Travel & Culture  ]
  [ 📚 Education & Study  ]
  [ 🌟 Personal Enrichment]

  Immediately after selection → OS Push Notification prompt appears.
  Our pre-prompt screen before the OS dialog:

  ┌────────────────────────────────┐
  │  🔔 Stay on track              │
  │  "We'll remind you to study    │
  │   at the right time — no       │
  │   spam, just smart nudges."    │
  │                                │
  │  [ Enable Notifications ]      │
  │  [ Not now ]                   │
  └────────────────────────────────┘

Notes:
  - If user taps "Not now" → skip, don't ask again for 7 days.
  - If user enables → schedule reminders after onboarding completion.
```

**Data collected:** `learningPurpose`, `notificationsEnabled`  
**Research basis:** Adapty — push notifications reduce onboarding drop-offs; opt-in rates are highest when asked with a clear value proposition.

---

### Step 3 – What Do You Want to Learn?

This is the **most important screen in onboarding**. It should feel exciting and personal.

```
Visual:
  "What do you want to learn about?"
  Subtitle: "Pick a topic — AI will build your list instantly."

  ┌──────────────────────────────────────────┐
  │  Topic input                              │
  │  Placeholder (rotating every 3s):        │
  │  "Germany Travel" → "AI Fundamentals"    │
  │  → "Legal English" → "Crypto Basics"     │
  └──────────────────────────────────────────┘

  Category chips (horizontal scroll, emoji + label):
  [ ✈️ Travel ] [ 💼 Business ] [ 💻 Tech ]
  [ 🏥 Health ] [ 🎓 Academic ] [ 🌍 Other ]
  Tapping a chip auto-fills a topic suggestion in the input.

  Word count selector (3-tab toggle):
  [ 15 words ] [ 30 words ] [ 50 words ]
  Default: 15

  List language (dropdown, collapsed by default):
  "List language: 🇬🇧 English ▼"
  Full dropdown: EN · TR · DE · FR · ES · IT · PT · NL · RU · JA · ZH · AR
  Default: device locale

  Description (accordion, collapsed):
  "+ Add description (optional — improves accuracy)"
  → expands to textarea (max 500 chars)

  [ ✨ Build My List → ]   ← sticky bottom CTA, enabled when topic ≥ 2 chars

Notes:
  - Category chip tap → auto-fill topic suggestion AND select category.
  - Rotating placeholders reduce blank-canvas anxiety and give vocabulary context.
  - Word count and language defaults are set from Firebase Remote Config.
  - Description field hidden by default to reduce cognitive load (NNG).
```

**Data collected:** `topic`, `topicCategory`, `listLanguage`, `wordCount`, `description?`, `learningGoals` (inferred from category)  
**Research basis:** Spotify onboarding model (visual/quick topic selection = instant personalization); VWO — interactive learning, single focus per screen.

---

### Step 4 – Loading → List Preview (The "Aha Moment")

This is a **two-phase screen**. The transition from Phase A to Phase B is the core emotional moment of onboarding.

#### Phase A — Generating (3–8 seconds)

```
Visual:
  Progress animation (circular, pulsing dots)
  "Building your personalised list…"

  Rotating micro-copy (every 2s):
  "Picking the most relevant words…"
  "Filtering for your level…"
  "Almost there — nearly ready…"
  "Adding context and examples…"

  Fun fact card fades in at 3s:
  💡 "Did you know? Learning 1000 words covers ~85% of everyday conversation."
```

#### Phase B — List Preview (after AI returns)

```
Visual:
  Celebration micro-animation (✨ sparkle, not full confetti — save that for trial start)

  "Your list is ready! 🎉"
  List title: "{topic}"  ← user's own words
  "{wordCount} words · {topicCategory}"

  First 5 words shown as preview cards:
  ┌──────────────────┐  ┌──────────────────┐
  │  Flughafen       │  │  Gepäck          │
  │  Airport         │  │  Luggage         │
  └──────────────────┘  └──────────────────┘
  ... and so on for 5 cards (horizontally scrollable)

  BELOW the preview, the rest is blurred + lock icon:
  ┌──────────────────────────────────────┐
  │  🔒 + {wordCount - 5} more words     │  ← blurred cards visible beneath
  │     Start your free trial to unlock  │
  └──────────────────────────────────────┘

  [ Start My Free Trial → ]

Notes:
  - The blurred "remaining words" creates desire (Visual scarcity → unlock motivation).
  - The lock icon is explanatory, not threatening.
  - 5 shown words must feel relevant and impressive.
  - If AI returns < 5 words (error): show error state, retry button.
```

**Research basis:**
- **"Post-value paywall"**: VWO (Speechify model — user sees value, THEN hits paywall)
- **Blurred remaining content**: Creates FOMO without feeling deceptive (user knows exactly what they locked)
- **Yazio model**: Paywall is personalized — user sees content related to their OWN goal

---

### Paywall — Hard Gate

**No close button. No skip. No free tier.**

```
Screen Layout:

  Header:
    "{name}, your list is waiting."
    Subtitle: "Start your free trial to access all {wordCount} words
               and begin learning {topic}."
    ← Topic-personalized headline using user's own data

  Benefits (bullet list):
  ✅ Access your full {wordCount}-word list
  ✅ Unlimited AI-generated vocabulary lists
  ✅ Flashcards & Quiz learning modes
  ✅ XP, Levels & Achievement system
  ✅ Track your progress list-by-list

  Plan selector:
  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────┐
  │    Weekly       │  │   Monthly        │  │  Annual    ⭐        │
  │                 │  │                 │  │  Best Value          │
  └─────────────────┘  └─────────────────┘  └──────────────────────┘
  Annual is pre-selected by default.
  Prices fetched from RevenueCat at runtime — no hardcoded prices.

  Trial indicator (below plan selector):
  "Try free for {trial_duration} days — then auto-renews."
  ← trial_duration from Firebase Remote Config (default: 7)

  [ Start {trial_duration}-Day Free Trial → ]   ← primary CTA

  Fine print:
  "Cancel anytime before trial ends. Auto-renews."
  "Restore Purchase" link (required by App Store)

On back navigation:
  → Returns user to Phase B (list preview), cannot go further back into main app.

On trial start:
  → RevenueCat purchase flow
  → On success: full-screen celebration (confetti + "You're in! 🎉")
  → XP +10 awarded immediately
  → "Newbie" achievement unlocked + shown
  → Navigate to Home screen with the user's first list already visible
```

**Research basis:**
- **Calm model**: Annual plan pre-selected (simplifies decision → higher conversion)
- **Yazio model**: Personalized headline ("your list for {topic}") vs. generic CTA
- **Speechify model**: "Try Free & Subscribe" — clear expectation setting
- **VWO**: Gamification starts at paywall conversion (instant badge reward)

---

## Onboarding State Machine

```typescript
type OnboardingState =
  | 'not_started'
  | 'step_1_done'       // name entered
  | 'step_2_done'       // purpose selected, push notif handled
  | 'step_3_done'       // topic/list settings submitted
  | 'list_generating'   // AI call in progress
  | 'list_ready'        // Preview shown, user looking at list
  | 'paywall_shown'
  | 'complete'          // Trial started, app unlocked

// Persisted: @vocabifyx/onboarding_state
// App language is NOT collected in onboarding — it is auto-detected from
// device locale (tr-* → Turkish, else English) and can be changed in Settings.
```

---

## Navigation Guard

```typescript
// app/_layout.tsx
const { onboardingState, isPremium } = useUserStore()

if (onboardingState !== 'complete' || !isPremium) {
  // Restore to correct onboarding step, don't restart from step 1
  const route = resumeOnboardingRoute(onboardingState)
  return <Redirect href={route} />
}
```

**Resumable onboarding:** If user closes the app mid-onboarding, we resume from where they left off.  
If list was already generated (state: `list_ready`) → go directly to preview, no re-generation.

---

## Edge Cases

| Scenario | Handling |
|----------|---------|
| AI generation fails | Error state with retry + "Try different topic" link |
| Network offline at Step 3 | Block Step 3 CTA with "Connect to internet to continue" |
| RevenueCat fails to load offerings | Show spinner → timeout → "Something went wrong, try again" |
| User force-quits at paywall | Resume at paywall with data cached (don't re-generate list) |
| User has already purchased (restore) | "Restore Purchase" → checks RC → unlocks if active |

---

## Analytics Events

```typescript
track('onboarding_started', { detectedLocale })
track('onboarding_step_completed', { step: 1 | 2 | 3, stepName })
track('onboarding_notification_permission', { granted: boolean })
track('onboarding_topic_set', { topic, topicCategory, wordCount, listLanguage, hasDescription })
track('onboarding_generation_started', { topic, wordCount })
track('onboarding_generation_succeeded', { topic, wordCount, durationMs })
track('onboarding_generation_failed', { errorType })
track('onboarding_preview_shown', { wordCount })
track('onboarding_paywall_shown', { plan: 'annual' })
track('onboarding_plan_switched', { toPlan })
track('onboarding_trial_started', { plan, trialDays })
track('onboarding_completed', { totalDurationMs })

// Funnel metrics to monitor:
// Install → onboarding_started → onboarding_paywall_shown → onboarding_trial_started
```

---

## Onboarding Screen Design Principles

| Principle | Implementation |
|-----------|---------------|
| One focus per screen | Each step has exactly one primary question/action |
| Fast pacing | No screen should require > 15s to complete (except loading) |
| Visual > text | Category chips use emoji + colour, not lists of text |
| Momentum | Each "Continue" tap should feel snappy with a brief transition animation |
| Desirability | The preview screen should make users feel they'd lose something by not subscribing |
| Trust | Benefits list in paywall references their actual content (personalized) |
| Clarity | "Try free for 7 days" — no small print surprises |
