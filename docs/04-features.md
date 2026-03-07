# VocabifyX – Features

> **Reference:** [MVP Scope](./02-mvp-scope.md) · [Learning Engine](./06-learning-engine.md) · [Gamification](./07-gamification.md) · [Explore](./08-explore.md)

---

## Feature Map

### 1. Home Screen

**Purpose:** Daily learning hub — shows user's lists, today's progress, and streak.

**UI Elements:**
- Greeting: "Good morning, {Name}! 👋"
- Today's stats card: sessions today, XP today, streak
- "My Lists" section with ListCards (2-col grid)
  - Each card: list name, topic, progress bar, [Flashcards] [Quiz] CTAs
- Empty state: "No lists yet. Create your first one! +"
- FAB (+) as center bottom nav item → Create List modal

**Acceptance Criteria:**
- [ ] Lists load from local store on mount
- [ ] Progress bar reflects real-time word completion %
- [ ] Streak counter is accurate (updates at midnight)
- [ ] FAB opens Create List bottom sheet

---

### 2. Create List (AI Generation)

**Purpose:** Generate a personalised vocabulary list via AI.

**UI Elements:**
- Bottom sheet modal
- Topic text input (placeholder: "e.g. Germany Travel, Machine Learning")
- Category picker (horizontal chip scroll)
- Optional description textarea (max 500 chars, char counter)
- Word count selector: [15] [30] [50]
- List language picker: **dropdown with all supported languages** (default = device locale)
- "✨ Generate" CTA button

**Flow:**
1. Input validation (topic required, min 2 chars)
2. Loading screen with animated illustration + "Generating your list..."
3. On success → List Preview screen
4. On error → Error state with retry

**Acceptance Criteria:**
- [ ] Validation prevents empty/short topic submission
- [ ] List language dropdown shows all supported languages, defaults to device locale
- [ ] Loading state shown during AI call
- [ ] Generated list saved to local store on success
- [ ] Error state handles network + AI failures

---

### 3. List Detail

**Purpose:** View all words in a list, start a learning session, see per-list stats.

**UI Elements:**
- Header: list name, topic category, word count
- Per-list stats: completion %, mastered words, sessions done
- Word list: term | translation | status badge
- Action buttons: [Start Flashcards] [Start Quiz]
- Options menu (···): Rename, Delete, Share (post-MVP)

**Acceptance Criteria:**
- [ ] All words with status displayed
- [ ] Correct completion % calculation
- [ ] Start buttons launch correct session mode
- [ ] Delete with confirmation dialog

---

### 4. Flashcard Session

**Acceptance Criteria:**
- [ ] Cards shown in shuffled order
- [ ] Tap-to-flip animation (rotateY)
- [ ] "Knew it / Didn't know" updates word status
- [ ] Session auto-ends when all cards reviewed
- [ ] Session summary screen shown on completion
- [ ] XP awarded and animated on summary screen
- [ ] Streak updated if first session today

---

### 5. Quiz Session

**Acceptance Criteria:**
- [ ] Questions generated from list words
- [ ] 4 multiple-choice options (1 correct + 3 distractors)
- [ ] Fill-in-the-blank questions included (min 20% of session)
- [ ] Immediate feedback after each answer
- [ ] Score and XP shown on summary screen
- [ ] Perfect score triggers achievement check

---

### 6. Explore Screen

**Acceptance Criteria:**
- [ ] Predefined lists load from constants (no network)
- [ ] Category filter works correctly
- [ ] "Add to My Library" copies list to user's local store
- [ ] Already-added lists show "In Library" state
- [ ] +5 XP animation on list add

---

### 7. Stats / Activity Screen

**Tabs: Daily | Weekly | Monthly**

**UI Elements:**
- Summary card: success rate (donut chart), streak, total XP
- Completed / Skipped / Failed counts (adapted: words reviewed / correct / incorrect)
- Achievement Progress: X/Y unlocked + total XP

**Acceptance Criteria:**
- [ ] Stats calculated from local session history
- [ ] Tab switch filters correctly
- [ ] Achievement progress ring updates real-time

---

### 8. Profile Screen

**UI Elements:**
- Avatar (initials-based) + Display name + Level badge
- XP bar (Level N → Level N+1)
- Stats chips: Days active, Logins, Lists, Words mastered
- Recent Achievements section (horizontal scroll)
- "See All" achievements button
- Settings gear icon (top right)

**Acceptance Criteria:**
- [ ] Level badge reflects current tier correctly
- [ ] XP bar shows progress to next level
- [ ] Recent achievements show last 3 unlocked

---

### 9. Settings Screen

**Sections:**
- Account: "Sign in to Sync" (Google / Apple) 
- Notifications: toggle + sub-settings
- App Language: TR / EN selector
- Subscription: "Manage Subscription" (opens RevenueCat manage URL)
- About / Legal: Privacy Policy, Terms of Service, App version

**Acceptance Criteria:**
- [ ] Language switch takes effect immediately (i18n provider re-renders)
- [ ] Notification toggles update local schedule
- [ ] "Manage Subscription" opens correct store page

---

### 10. Onboarding + Paywall

See [09-onboarding.md](./09-onboarding.md) and [10-monetization.md](./10-monetization.md).
