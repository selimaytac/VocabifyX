# VocabifyX – UI Design System

> **Reference:** [Architecture](./03-app-architecture.md) · Example UI: `/example-images-from-other-app/`

---

## Design Direction

Inspired by the clean, card-based UI of the reference habit app, adapted for a vocabulary learning context. No mascot. The UI should feel:

- **Premium** – clean whitespace, smooth animations
- **Motivating** – XP bars, level badges, progress rings feel alive
- **Focused** – Learning sessions are distraction-free
- **Modern** – Subtle gradients, rounded cards, bold type

---

## Colour Palette

### Primary Palette

```
Primary:    #6C63FF  (Indigo Purple)  ← Brand colour
Secondary:  #FF6B6B  (Coral Red)     ← Accent / XP highlights
Success:    #2ECC71  (Emerald)
Warning:    #F39C12  (Amber)
Error:      #E74C3C  (Red)

Background: #F8F9FE  (Off-white, very light lavender)
Surface:    #FFFFFF  (Cards)
```

### Level Tier Colours

```
Bronze:   #CD7F32
Silver:   #A8A9AD
Gold:     #FFD700
Platinum: #9B59B6
Diamond:  #00BCD4
Legend:   #FF6B6B (coral gradient)
```

### Neutral Scale

```
Gray-50:  #F8F9FE
Gray-100: #EEEEF5
Gray-200: #D1D1DB
Gray-400: #9292A4
Gray-600: #5C5C70
Gray-900: #1A1A2E  (Dark text)
```

---

## Typography

**Font:** Inter (Google Fonts, all weights via expo-font)

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Display | 28px | 700 | Screen titles |
| Heading 1 | 22px | 700 | Section headers |
| Heading 2 | 18px | 600 | Card titles |
| Body | 16px | 400 | Default body text |
| Body Bold | 16px | 600 | Emphasis |
| Caption | 13px | 400 | Labels, hints |
| XS | 11px | 500 | Badges, tags |

---

## Core Components

### ListCard
Used on Home screen to display a user's vocabulary list.

```
┌─────────────────────────────────────────────┐
│  🌍  Germany Travel                    [···] │
│      Travel • 30 words                       │
│                                              │
│  ██████████████░░░░░░░  60% learned          │
│                                              │
│  [ Flashcards ]  [ Quiz ]                   │
└─────────────────────────────────────────────┘
```

- Rounded corners: 16px
- Shadow: subtle (elevation 2)
- Progress bar: branded gradient (primary → secondary)

### FlashCard
Full-screen card during flashcard mode. Flip animation (rotateY).

```
Front:
┌──────────────────────────┐
│                          │
│        Angst             │  ← term, large bold
│                          │
│     Tap to reveal →      │  ← hint, small gray
└──────────────────────────┘

Back:
┌──────────────────────────┐
│  Fear / Anxiety          │  ← translation
│                          │
│  "Er hat Angst vor..."   │  ← example, italic
│                          │
│ [ ❌ Didn't know ] [ ✅ Knew it ] │
└──────────────────────────┘
```

### XP Bar (Profile + Session Summary)
Animated progress bar with glow effect. On level-up: plays "fill and overflow" animation before resetting.

```
Bronze · Lv.2          350 / 500 XP
[████████████░░░░░░░░░]
```

### Achievement Badge
Hexagonal badge (matching reference app). Colour-coded by tier.

```
     ╔══════╗
    ╔  icon  ╗
    ╚  name  ╝
     ╚══════╝
```

### QuizQuestion Card
Clean, focused. No clutter. 4 answer options as tappable rounded buttons.

```
What does "Wanderlust" mean?

  [ A) A type of bread      ]
  [ B) A love of travel  ✅ ] ← highlights on answer
  [ C) A city in Germany    ]
  [ D) Homesickness         ]

Question 3/10        ████░░░░░░ 30%
```

---

## Navigation Bar

5-tab bottom nav (matching reference app pattern):

```
[ 🏠 Home ] [ 🧭 Explore ] [ ＋ ] [ 📊 Stats ] [ 👤 Profile ]
```

- Center FAB: `+` button (dark navy, large) → opens Create List modal
- Active tab: brand purple
- Inactive: gray-400
- Rounded pill container (card-style)

---

## Animations

| Interaction | Animation |
|-------------|-----------|
| Flashcard flip | `rotateY` 0° → 180° (Reanimated) |
| XP bar fill | `width` tween, spring |
| Level up modal | Confetti + scale entrance |
| Achievement unlock | Slide-up sheet + badge pop |
| Session complete | Checkmark draw + XP number count-up |
| Card swipe (quiz) | Horizontal slide (Reanimated gesture) |
| Screen transition | Default expo-router slide |
| List add (Explore) | Bounce animation on button |

---

## Screen Layout Patterns

### Standard Screen
```
SafeAreaView
  ScrollView
    ← Header (title + optional right action)
    ← Content sections
  BottomTabBar
```

### Session Screen (Flashcard / Quiz)
```
SafeAreaView (no tab bar)
  ← Back button + Progress bar
  ← Card (centered, full-width)
  ← Action buttons at bottom
```

### Modal (Create List)
```
Sheet (slides up from bottom)
  ← Drag handle
  ← Form fields
  ← CTA button (sticky at bottom)
```

---

## Screen-by-Screen Summary

| Screen | Key Elements |
|--------|-------------|
| Home | Greeting, today's stats card, "My Lists" grid, streak card |
| Explore | Category tabs (horizontal), 2-col list grid, "Add" CTA |
| Stats | Daily/Weekly/Monthly toggle, success rate ring, XP + achievements |
| Profile | Level badge, XP bar, quick stats chips, recent achievements |
| Create List | Topic input, category picker, description textarea, word count selector |
| Flashcard | Full-screen card with flip animation, known/unknown buttons |
| Quiz | Question card, 4 options, timer (optional), score progress |
| Onboarding | Step indicator, one-focus-per-screen, large CTAs |
| Paywall | Plan cards, trial CTA, benefit bullets |
