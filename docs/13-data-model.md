# VocabifyX – Data Model

> **Reference:** [Architecture](./03-app-architecture.md) · [Learning Engine](./06-learning-engine.md) · [Gamification](./07-gamification.md)

---

## Storage Strategy

**MVP: Local-first (AsyncStorage)**  
All data lives on-device. No login required. Supabase schema is designed for v1.1 sync — keys and IDs are UUID-compatible from day one.

**v1.1: Supabase sync**  
On "Sign in to Sync", local data is pushed to Supabase and a two-way sync is established.

---

## Local Data Structures (AsyncStorage)

### `@vocabifyx/user`
```typescript
interface UserProfile {
  id: string              // UUID (generated on first launch)
  displayName: string
  nativeLanguage: 'TR' | 'EN'
  appLanguage: 'TR' | 'EN'
  learningGoals: string[]
  createdAt: string       // ISO date
  
  // Gamification
  totalXP: number
  currentLevel: number
  currentStreak: number
  longestStreak: number
  lastStudiedAt: string   // ISO date
  
  // Subscription
  isPremium: boolean
  premiumSince?: string
  
  // Flags
  onboardingComplete: boolean
  onboardingState: string
}
```

### `@vocabifyx/lists`
```typescript
interface UserVocabList {
  id: string              // UUID
  name: string            // User-defined or AI-generated
  topic: string
  topicCategory: string
  description?: string
  listLanguage: string       // e.g. 'English', 'German' — full language name used in AI prompt
  wordCount: number
  source: 'ai_generated' | 'explore' | 'manual'
  sourceId?: string       // explores list ID if source = 'explore'
  createdAt: string
  lastStudiedAt?: string
  
  words: VocabWord[]
  
  // Computed on read
  completionPercent: number
  masteredCount: number
}

interface VocabWord {
  id: string
  term: string
  translation: string
  example: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  partOfSpeech: string
  
  // Progress
  status: 'not_started' | 'learning' | 'learned' | 'mastered'
  timesCorrect: number
  timesWrong: number
  lastStudied?: string
  nextReview?: string     // for future SRS
}
```

### `@vocabifyx/sessions`
```typescript
interface LearningSession {
  id: string
  listId: string
  mode: 'flashcard' | 'quiz'
  startedAt: string
  completedAt?: string
  xpEarned: number
  wordsReviewed: number
  correctAnswers: number
  duration: number        // seconds
}
```

### `@vocabifyx/achievements`
```typescript
interface UserAchievement {
  achievementId: string
  unlockedAt: string
  xpAwarded: number
}
```

### `@vocabifyx/settings`
```typescript
interface AppSettings {
  notifications: {
    enabled: boolean
    studyReminders: boolean
    streakAlerts: boolean
    achievementAlerts: boolean
    quietStart?: string   // "22:00"
    quietEnd?: string     // "08:00"
  }
}
```

---

## Supabase Schema (v1.1 Sync Ready)

```sql
-- Users (synced from local profile)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  display_name TEXT,
  native_language TEXT,
  app_language TEXT,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_studied_at TIMESTAMPTZ,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vocabulary Lists
CREATE TABLE vocab_lists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  topic TEXT NOT NULL,
  topic_category TEXT,
  description TEXT,
  list_language TEXT,
  source TEXT,             -- 'ai_generated' | 'explore' | 'manual'
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_studied_at TIMESTAMPTZ
);

-- Words in Lists
CREATE TABLE vocab_words (
  id UUID PRIMARY KEY,
  list_id UUID REFERENCES vocab_lists(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  example TEXT,
  difficulty TEXT,
  part_of_speech TEXT,
  status TEXT DEFAULT 'not_started',
  times_correct INTEGER DEFAULT 0,
  times_wrong INTEGER DEFAULT 0,
  last_studied TIMESTAMPTZ,
  next_review TIMESTAMPTZ
);

-- Learning Sessions
CREATE TABLE learning_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  list_id UUID REFERENCES vocab_lists(id),
  mode TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  xp_earned INTEGER DEFAULT 0,
  words_reviewed INTEGER,
  correct_answers INTEGER,
  duration_seconds INTEGER
);

-- Achievements
CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  xp_awarded INTEGER,
  PRIMARY KEY (user_id, achievement_id)
);

-- AI Usage Logging (Edge Function logs)
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  model TEXT,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  duration_ms INTEGER,
  success BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Data Access Pattern

```typescript
// store/lists.store.ts (Zustand)
interface ListsStore {
  lists: UserVocabList[]
  
  addList: (list: UserVocabList) => void
  updateList: (id: string, updates: Partial<UserVocabList>) => void
  deleteList: (id: string) => void
  updateWordProgress: (listId: string, wordId: string, result: 'correct' | 'incorrect') => void
  
  _persist: () => void      // saves to AsyncStorage
  _hydrate: () => Promise<void>  // loads from AsyncStorage on app start
}
```
