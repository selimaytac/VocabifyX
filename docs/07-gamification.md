# VocabifyX – Gamification

> **Reference:** [Learning Engine](./06-learning-engine.md) · [Stats](./04-features.md)

---

## Philosophy

Gamification in VocabifyX must feel **earned, not gimmicky**. Every XP point, badge, and level tier should reflect real learning progress. The goal: users feel momentum and accomplishment after every session.

---

## XP System

### XP Sources

| Action | XP |
|--------|----|
| Flashcard: "I knew it" | +2 XP |
| Quiz: Correct answer | +3 XP (MC) / +4 XP (fill-in) |
| Complete a flashcard session | +5 XP bonus |
| Complete a quiz session | +10 XP bonus |
| First session on a new list | +5 XP bonus |
| Daily login | +3 XP |
| Maintain daily streak | +streak_day × 1 XP (capped at +10) |
| Add a list from Explore | +5 XP |
| Complete (100%) a list | +20 XP |
| Master a list (all words mastered) | +50 XP |

---

## Level System

| Level | Tier | XP Required | Badge Colour |
|-------|------|-------------|-------------|
| 1 | Bronze · Lv.1 | 0 | 🟤 Bronze |
| 2 | Bronze · Lv.2 | 100 | 🟤 Bronze |
| 3 | Bronze · Lv.3 | 250 | 🟤 Bronze |
| 4 | Silver · Lv.1 | 500 | ⚪ Silver |
| 5 | Silver · Lv.2 | 800 | ⚪ Silver |
| 6 | Silver · Lv.3 | 1,200 | ⚪ Silver |
| 7 | Gold · Lv.1 | 1,800 | 🟡 Gold |
| 8 | Gold · Lv.2 | 2,500 | 🟡 Gold |
| 9 | Gold · Lv.3 | 3,500 | 🟡 Gold |
| 10 | Platinum · Lv.1 | 5,000 | 💜 Platinum |
| 11 | Platinum · Lv.2 | 7,000 | 💜 Platinum |
| 12 | Platinum · Lv.3 | 10,000 | 💜 Platinum |
| 13 | Diamond · Lv.1 | 15,000 | 💎 Diamond |
| 14 | Diamond · Lv.2 | 22,000 | 💎 Diamond |
| 15 | Diamond · Lv.3 | 30,000 | 💎 Diamond |
| 16+ | Legend | 50,000+ | 🌟 Legend |

### Level-up Celebration
On level-up: full-screen animated celebration (confetti + sound), notification if app is backgrounded.

---

## Streak System

- **Daily streak**: Study at least 1 session per calendar day
- **Streak displayed on**: Home screen, Profile header, Session summary
- Streak resets at midnight (local time)
- **Streak protection** (post-MVP): Premium users can "freeze" streak once/week

### Streak Milestones (XP Bonus)
- 3-day streak: +15 XP bonus
- 7-day streak: +30 XP bonus
- 30-day streak: +100 XP bonus
- 100-day streak: +300 XP bonus

---

## Achievement System

### Achievement Definition

```typescript
interface Achievement {
  id: string
  titleKey: string          // i18n key
  descriptionKey: string    // i18n key
  icon: string              // emoji or image asset
  badgeColour: string       // hex
  xpReward: number
  condition: AchievementCondition
}

type AchievementCondition =
  | { type: 'lists_created'; count: number }
  | { type: 'words_mastered'; count: number }
  | { type: 'sessions_completed'; count: number }
  | { type: 'streak_days'; count: number }
  | { type: 'lists_completed'; count: number }
  | { type: 'explore_added'; count: number }
  | { type: 'quiz_perfect'; count: number }         // perfect quiz score
  | { type: 'level_reached'; level: number }
```

### MVP Achievement List

| ID | Badge | Name (EN) | Condition | XP |
|----|-------|-----------|-----------|-----|
| `newbie` | 🌱 | Newbie | Create 1st list | 10 |
| `explorer` | 🧭 | Explorer | Add 1 list from Explore | 10 |
| `first_session` | 📖 | First Step | Complete 1 session | 10 |
| `streak_3` | 🔥 | On Fire | 3-day streak | 15 |
| `streak_7` | 🔥🔥 | Week Warrior | 7-day streak | 30 |
| `streak_30` | 🏆 | Monthly Master | 30-day streak | 100 |
| `words_50` | 📚 | Word Collector | Master 50 words | 25 |
| `words_200` | 📚📚 | Vocabulary Builder | Master 200 words | 75 |
| `words_500` | 🎓 | Vocab Scholar | Master 500 words | 150 |
| `list_complete` | ✅ | Completionist | Complete 1 full list | 20 |
| `lists_5` | 🗂️ | Multi-learner | Complete 5 lists | 50 |
| `quiz_perfect` | ⭐ | Perfect Score | Get 100% on a quiz | 20 |
| `silver_reached` | ⚪ | Silver Scholar | Reach Silver tier | 30 |
| `gold_reached` | 🟡 | Gold Mind | Reach Gold tier | 50 |

### Achievement Unlock Flow
1. After each session / action, check relevant conditions
2. If newly unlocked → show full-screen achievement modal (slide up)
3. "+10 XP" animation on profile XP bar
4. Save unlock timestamp locally

---

## Stats Visible to User

### Global (Profile Screen)
- Current level badge (e.g. "Silver · Lv.2")
- XP bar: current XP / XP to next level
- Total XP earned
- Current streak + longest streak
- Total words mastered
- Total sessions completed
- Achievements: X/Y unlocked → "See All"

### Per-List (List Detail Screen)
- Completion %: words learned / total words
- Mastered words count
- Sessions completed on this list
- Average quiz score
- Last studied date
