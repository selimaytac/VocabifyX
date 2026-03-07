# VocabifyX – Learning Engine

> **Reference:** [Features](./04-features.md) · [Gamification](./07-gamification.md) · [Data Model](./13-data-model.md)

---

## Overview

The learning engine handles the core study experience. For MVP, we implement two modes:

1. **Flashcard Mode** – Flip-based card review
2. **Quiz Mode** – Multiple choice + fill-in-the-blank

Both modes feed into the gamification system (XP, streaks) and per-list progress tracking.

---

## Flashcard Mode

### Flow

```
Session Start
  → Show words shuffled (not yet "known")
  → Each card:
     - Front: term (in listLanguage)  
     - Tap → Flip → Back: translation + example sentence
     - User marks: ✅ "I knew it" / ❌ "I didn't know"
  → Session ends when all cards reviewed
  → Session Summary: X/Y known, XP earned, streak update
```

### Card UI

```
┌─────────────────────────────────┐
│                                 │
│         [ TERM ]                │  ← Front
│    in list language             │
│                                 │
│   Tap to flip                   │
└─────────────────────────────────┘

After flip:

┌─────────────────────────────────┐
│  TRANSLATION                    │  ← Back
│  in native language             │
│                                 │
│  "Example: ..."                 │
│                                 │
│  [ ✅ Knew it ]  [ ❌ Didn't ]  │
└─────────────────────────────────┘
```

### Scoring
- "Knew it" → word marked as `status: learned`, `+2 XP`
- "Didn't know" → word stays `status: learning`
- Session completion bonus: `+5 XP`

---

## Quiz Mode

### Question Types

#### 1. Multiple Choice (4 options)
- Question: "What does **[term]** mean?"
- 4 options: 1 correct translation + 3 distractors (from same list or random)
- `+3 XP` per correct answer, 0 XP for wrong

#### 2. Fill-in-the-Blank
- "Complete the sentence: ____ is the capital of Germany"
- Text input, case-insensitive matching, strip punctuation
- `+4 XP` per correct, 0 for wrong

### Quiz Flow

```
Quiz Session
  → N questions (10 for 15-word list, 20 for 30, 30 for 50)
  → Each question: 15s timer (optional, Firebase Remote Config)
  → Immediate feedback after each answer (✅/❌ + correct answer shown)
  → Session end: Score summary + XP breakdown + badge check
```

---

## Session State Management

```typescript
interface LearningSession {
  id: string
  listId: string
  mode: 'flashcard' | 'quiz'
  startedAt: Date
  completedAt?: Date
  words: SessionWord[]
  xpEarned: number
  score?: number  // quiz mode only
}

interface SessionWord {
  wordId: string
  shown: boolean
  answeredCorrectly?: boolean
  timeSpentMs?: number
}
```

Sessions are persisted locally so interrupted sessions can be resumed (within 24h).

---

## Progress Tracking Per Word

```typescript
type WordStatus = 'not_started' | 'learning' | 'learned' | 'mastered'

interface WordProgress {
  wordId: string
  status: WordStatus
  timesCorrect: number
  timesWrong: number
  lastStudied: Date
  nextReview?: Date  // spaced repetition (post-MVP)
}
```

### Status Transitions

```
not_started → learning   (shown once, answered wrong)
not_started → learned    (shown once, answered correctly)
learning    → learned    (answered correctly 2+ times)
learned     → mastered   (answered correctly 5+ times total)
```

---

## Per-List Completion

A list is considered:
- **In Progress** if any word is `learning` or `learned`
- **Completed** if all words are `learned` or `mastered`
- **Mastered** if all words are `mastered`

---

## Session Summary Screen

After each session:

```
┌────────────────────────────────┐
│  🎉 Session Complete!          │
│                                │
│  Words Reviewed: 15            │
│  ✅ Knew: 12  ❌ Learning: 3  │
│                                │
│  +42 XP earned                 │
│  🔥 Streak: 5 days             │
│                                │
│  [ Study Again ]  [ Done ]     │
└────────────────────────────────┘
```

---

## Future: Spaced Repetition (v1.2)

Post-MVP, implement SM-2 algorithm:
- Each word gets a `nextReview` date based on performance
- "Due Today" section on Home screen shows words due for review
- Reduces review sessions for mastered words, increases for difficult ones
