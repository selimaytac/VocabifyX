import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  type Achievement,
  ACHIEVEMENTS,
  type AchievementCondition,
} from "@/constants/achievements";
import { getLevelForXP, type LevelDefinition } from "@/constants/levels";
import { createZustandStorage } from "@/utils/zustand.utils";

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  xpAwarded: number;
}

export interface GameStats {
  listsCreated: number;
  wordsMastered: number;
  sessionsCompleted: number;
  listsCompleted: number;
  exploreAdded: number;
  quizPerfectScores: number;
}

interface GameState {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastStudiedAt: string | null;
  achievements: UserAchievement[];
  stats: GameStats;

  awardXP: (amount: number) => void;
  updateStreak: () => void;
  incrementStat: (stat: keyof GameStats, amount?: number) => void;
  checkAndUnlockAchievements: () => Achievement[];
  getCurrentLevel: () => LevelDefinition;
  reset: () => void;
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  );
}

function checkCondition(
  condition: AchievementCondition,
  stats: GameStats,
  currentStreak: number,
  currentLevel: number,
): boolean {
  switch (condition.type) {
    case "lists_created":
      return stats.listsCreated >= condition.count;
    case "words_mastered":
      return stats.wordsMastered >= condition.count;
    case "sessions_completed":
      return stats.sessionsCompleted >= condition.count;
    case "streak_days":
      return currentStreak >= condition.count;
    case "lists_completed":
      return stats.listsCompleted >= condition.count;
    case "explore_added":
      return stats.exploreAdded >= condition.count;
    case "quiz_perfect":
      return stats.quizPerfectScores >= condition.count;
    case "level_reached":
      return currentLevel >= condition.level;
    default:
      return false;
  }
}

const initialState = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudiedAt: null as string | null,
  achievements: [] as UserAchievement[],
  stats: {
    listsCreated: 0,
    wordsMastered: 0,
    sessionsCompleted: 0,
    listsCompleted: 0,
    exploreAdded: 0,
    quizPerfectScores: 0,
  } as GameStats,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      awardXP: (amount) =>
        set((state) => ({
          totalXP: state.totalXP + amount,
        })),

      updateStreak: () =>
        set((state) => {
          const now = new Date().toISOString();

          if (state.lastStudiedAt && isToday(state.lastStudiedAt)) {
            return { lastStudiedAt: now };
          }

          if (state.lastStudiedAt && isYesterday(state.lastStudiedAt)) {
            const newStreak = state.currentStreak + 1;
            return {
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, state.longestStreak),
              lastStudiedAt: now,
            };
          }

          return {
            currentStreak: 1,
            longestStreak: Math.max(1, state.longestStreak),
            lastStudiedAt: now,
          };
        }),

      incrementStat: (stat, amount = 1) =>
        set((state) => ({
          stats: {
            ...state.stats,
            [stat]: state.stats[stat] + amount,
          },
        })),

      checkAndUnlockAchievements: () => {
        const state = get();
        const currentLevel = getLevelForXP(state.totalXP).level;
        const unlockedIds = new Set(
          state.achievements.map((a) => a.achievementId),
        );
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
          if (unlockedIds.has(achievement.id)) continue;

          if (
            checkCondition(
              achievement.condition,
              state.stats,
              state.currentStreak,
              currentLevel,
            )
          ) {
            newlyUnlocked.push(achievement);
          }
        }

        if (newlyUnlocked.length > 0) {
          let totalBonusXP = 0;
          const newAchievementRecords: UserAchievement[] = newlyUnlocked.map(
            (a) => {
              totalBonusXP += a.xpReward;
              return {
                achievementId: a.id,
                unlockedAt: new Date().toISOString(),
                xpAwarded: a.xpReward,
              };
            },
          );

          set((state) => ({
            achievements: [...state.achievements, ...newAchievementRecords],
            totalXP: state.totalXP + totalBonusXP,
          }));
        }

        return newlyUnlocked;
      },

      getCurrentLevel: () => {
        return getLevelForXP(get().totalXP);
      },

      reset: () => set(initialState),
    }),
    {
      name: "vocabifyx-game",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
