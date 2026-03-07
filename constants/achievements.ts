export type AchievementCondition =
  | { type: "lists_created"; count: number }
  | { type: "words_mastered"; count: number }
  | { type: "sessions_completed"; count: number }
  | { type: "streak_days"; count: number }
  | { type: "lists_completed"; count: number }
  | { type: "explore_added"; count: number }
  | { type: "quiz_perfect"; count: number }
  | { type: "level_reached"; level: number };

export interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  badgeColor: string;
  xpReward: number;
  condition: AchievementCondition;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "newbie",
    titleKey: "achievement.newbie.title",
    descriptionKey: "achievement.newbie.desc",
    icon: "🌱",
    badgeColor: "#30A46C",
    xpReward: 10,
    condition: { type: "lists_created", count: 1 },
  },
  {
    id: "explorer",
    titleKey: "achievement.explorer.title",
    descriptionKey: "achievement.explorer.desc",
    icon: "🧭",
    badgeColor: "#0a7ea4",
    xpReward: 10,
    condition: { type: "explore_added", count: 1 },
  },
  {
    id: "first_session",
    titleKey: "achievement.firstSession.title",
    descriptionKey: "achievement.firstSession.desc",
    icon: "📖",
    badgeColor: "#F5A623",
    xpReward: 10,
    condition: { type: "sessions_completed", count: 1 },
  },
  {
    id: "streak_3",
    titleKey: "achievement.streak3.title",
    descriptionKey: "achievement.streak3.desc",
    icon: "🔥",
    badgeColor: "#E5484D",
    xpReward: 15,
    condition: { type: "streak_days", count: 3 },
  },
  {
    id: "streak_7",
    titleKey: "achievement.streak7.title",
    descriptionKey: "achievement.streak7.desc",
    icon: "🔥",
    badgeColor: "#E5484D",
    xpReward: 30,
    condition: { type: "streak_days", count: 7 },
  },
  {
    id: "streak_30",
    titleKey: "achievement.streak30.title",
    descriptionKey: "achievement.streak30.desc",
    icon: "🏆",
    badgeColor: "#FFD700",
    xpReward: 100,
    condition: { type: "streak_days", count: 30 },
  },
  {
    id: "words_50",
    titleKey: "achievement.words50.title",
    descriptionKey: "achievement.words50.desc",
    icon: "📚",
    badgeColor: "#9B59B6",
    xpReward: 25,
    condition: { type: "words_mastered", count: 50 },
  },
  {
    id: "words_200",
    titleKey: "achievement.words200.title",
    descriptionKey: "achievement.words200.desc",
    icon: "📚",
    badgeColor: "#9B59B6",
    xpReward: 75,
    condition: { type: "words_mastered", count: 200 },
  },
  {
    id: "words_500",
    titleKey: "achievement.words500.title",
    descriptionKey: "achievement.words500.desc",
    icon: "🎓",
    badgeColor: "#00CED1",
    xpReward: 150,
    condition: { type: "words_mastered", count: 500 },
  },
  {
    id: "list_complete",
    titleKey: "achievement.listComplete.title",
    descriptionKey: "achievement.listComplete.desc",
    icon: "✅",
    badgeColor: "#30A46C",
    xpReward: 20,
    condition: { type: "lists_completed", count: 1 },
  },
  {
    id: "lists_5",
    titleKey: "achievement.lists5.title",
    descriptionKey: "achievement.lists5.desc",
    icon: "🗂️",
    badgeColor: "#0a7ea4",
    xpReward: 50,
    condition: { type: "lists_completed", count: 5 },
  },
  {
    id: "quiz_perfect",
    titleKey: "achievement.quizPerfect.title",
    descriptionKey: "achievement.quizPerfect.desc",
    icon: "⭐",
    badgeColor: "#FFD700",
    xpReward: 20,
    condition: { type: "quiz_perfect", count: 1 },
  },
  {
    id: "silver_reached",
    titleKey: "achievement.silverReached.title",
    descriptionKey: "achievement.silverReached.desc",
    icon: "⚪",
    badgeColor: "#C0C0C0",
    xpReward: 30,
    condition: { type: "level_reached", level: 4 },
  },
  {
    id: "gold_reached",
    titleKey: "achievement.goldReached.title",
    descriptionKey: "achievement.goldReached.desc",
    icon: "🟡",
    badgeColor: "#FFD700",
    xpReward: 50,
    condition: { type: "level_reached", level: 7 },
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
