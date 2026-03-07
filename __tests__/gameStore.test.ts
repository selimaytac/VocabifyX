import { useGameStore } from "@/store/gameStore";

describe("gameStore", () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  describe("awardXP", () => {
    it("should start with 0 XP", () => {
      expect(useGameStore.getState().totalXP).toBe(0);
    });

    it("should add XP", () => {
      useGameStore.getState().awardXP(10);
      expect(useGameStore.getState().totalXP).toBe(10);
    });

    it("should accumulate XP from multiple awards", () => {
      useGameStore.getState().awardXP(10);
      useGameStore.getState().awardXP(20);
      expect(useGameStore.getState().totalXP).toBe(30);
    });

    it("should detect level-up and set pendingLevelUp", () => {
      // Level 2 starts at 100 XP
      useGameStore.getState().awardXP(100);
      expect(useGameStore.getState().pendingLevelUp).not.toBeNull();
      expect(useGameStore.getState().pendingLevelUp?.level).toBe(2);
    });

    it("should not set pendingLevelUp when no level change", () => {
      useGameStore.getState().awardXP(10);
      expect(useGameStore.getState().pendingLevelUp).toBeNull();
    });
  });

  describe("clearPendingLevelUp", () => {
    it("should clear pendingLevelUp", () => {
      useGameStore.getState().awardXP(100);
      expect(useGameStore.getState().pendingLevelUp).not.toBeNull();
      useGameStore.getState().clearPendingLevelUp();
      expect(useGameStore.getState().pendingLevelUp).toBeNull();
    });
  });

  describe("clearPendingAchievements", () => {
    it("should clear pendingAchievements after unlock", () => {
      useGameStore.getState().incrementStat("listsCreated");
      useGameStore.getState().checkAndUnlockAchievements();
      expect(
        useGameStore.getState().pendingAchievements.length,
      ).toBeGreaterThan(0);
      useGameStore.getState().clearPendingAchievements();
      expect(useGameStore.getState().pendingAchievements).toHaveLength(0);
    });
  });

  describe("updateStreak", () => {
    it("should start streak at 1 on first study", () => {
      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(1);
      expect(useGameStore.getState().longestStreak).toBe(1);
      expect(useGameStore.getState().lastStudiedAt).toBeDefined();
    });

    it("should not increment streak on same-day study", () => {
      useGameStore.getState().updateStreak();
      const firstStreak = useGameStore.getState().currentStreak;
      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(firstStreak);
    });

    it("should reset streak if gap is more than 1 day", () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      useGameStore.setState({
        currentStreak: 5,
        longestStreak: 5,
        lastStudiedAt: twoDaysAgo.toISOString(),
      });

      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(1);
      expect(useGameStore.getState().longestStreak).toBe(5);
    });

    it("should increment streak for consecutive days", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useGameStore.setState({
        currentStreak: 3,
        longestStreak: 3,
        lastStudiedAt: yesterday.toISOString(),
      });

      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(4);
      expect(useGameStore.getState().longestStreak).toBe(4);
    });

    it("should award bonus XP on 3-day streak milestone", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useGameStore.setState({
        currentStreak: 2,
        longestStreak: 2,
        lastStudiedAt: yesterday.toISOString(),
        totalXP: 0,
      });

      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(3);
      expect(useGameStore.getState().totalXP).toBe(15);
    });

    it("should award bonus XP on 7-day streak milestone", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useGameStore.setState({
        currentStreak: 6,
        longestStreak: 6,
        lastStudiedAt: yesterday.toISOString(),
        totalXP: 0,
      });

      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(7);
      expect(useGameStore.getState().totalXP).toBe(30);
    });

    it("should not award bonus XP on non-milestone streaks", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      useGameStore.setState({
        currentStreak: 4,
        longestStreak: 4,
        lastStudiedAt: yesterday.toISOString(),
        totalXP: 0,
      });

      useGameStore.getState().updateStreak();
      expect(useGameStore.getState().currentStreak).toBe(5);
      expect(useGameStore.getState().totalXP).toBe(0);
    });
  });

  describe("incrementStat", () => {
    it("should increment a stat by 1 by default", () => {
      useGameStore.getState().incrementStat("listsCreated");
      expect(useGameStore.getState().stats.listsCreated).toBe(1);
    });

    it("should increment a stat by custom amount", () => {
      useGameStore.getState().incrementStat("wordsMastered", 5);
      expect(useGameStore.getState().stats.wordsMastered).toBe(5);
    });

    it("should accumulate stat increments", () => {
      useGameStore.getState().incrementStat("sessionsCompleted");
      useGameStore.getState().incrementStat("sessionsCompleted");
      expect(useGameStore.getState().stats.sessionsCompleted).toBe(2);
    });
  });

  describe("checkAndUnlockAchievements", () => {
    it("should unlock newbie achievement after creating 1 list", () => {
      useGameStore.getState().incrementStat("listsCreated");
      const unlocked = useGameStore.getState().checkAndUnlockAchievements();
      expect(unlocked.length).toBeGreaterThanOrEqual(1);
      expect(unlocked.some((a) => a.id === "newbie")).toBe(true);
    });

    it("should unlock explorer achievement after adding from explore", () => {
      useGameStore.getState().incrementStat("exploreAdded");
      const unlocked = useGameStore.getState().checkAndUnlockAchievements();
      expect(unlocked.some((a) => a.id === "explorer")).toBe(true);
    });

    it("should unlock first_session after completing 1 session", () => {
      useGameStore.getState().incrementStat("sessionsCompleted");
      const unlocked = useGameStore.getState().checkAndUnlockAchievements();
      expect(unlocked.some((a) => a.id === "first_session")).toBe(true);
    });

    it("should not unlock already unlocked achievements", () => {
      useGameStore.getState().incrementStat("listsCreated");
      useGameStore.getState().checkAndUnlockAchievements();

      const secondCheck = useGameStore.getState().checkAndUnlockAchievements();
      expect(secondCheck.some((a) => a.id === "newbie")).toBe(false);
    });

    it("should award XP for unlocked achievements", () => {
      useGameStore.getState().incrementStat("listsCreated");
      const before = useGameStore.getState().totalXP;
      useGameStore.getState().checkAndUnlockAchievements();
      const after = useGameStore.getState().totalXP;
      expect(after).toBeGreaterThan(before);
    });

    it("should store achievement records with timestamps", () => {
      useGameStore.getState().incrementStat("listsCreated");
      useGameStore.getState().checkAndUnlockAchievements();

      const achievements = useGameStore.getState().achievements;
      expect(achievements.length).toBeGreaterThanOrEqual(1);
      const newbie = achievements.find((a) => a.achievementId === "newbie");
      expect(newbie).toBeDefined();
      expect(newbie?.unlockedAt).toBeDefined();
      expect(newbie?.xpAwarded).toBe(10);
    });

    it("should populate pendingAchievements when achievements are unlocked", () => {
      useGameStore.getState().incrementStat("listsCreated");
      useGameStore.getState().checkAndUnlockAchievements();
      expect(
        useGameStore.getState().pendingAchievements.length,
      ).toBeGreaterThan(0);
      expect(
        useGameStore
          .getState()
          .pendingAchievements.some((a) => a.id === "newbie"),
      ).toBe(true);
    });

    it("should not populate pendingAchievements when nothing is unlocked", () => {
      useGameStore.getState().checkAndUnlockAchievements();
      expect(useGameStore.getState().pendingAchievements).toHaveLength(0);
    });
  });

  describe("getCurrentLevel", () => {
    it("should return level 1 at 0 XP", () => {
      const level = useGameStore.getState().getCurrentLevel();
      expect(level.level).toBe(1);
      expect(level.tier).toBe("Bronze");
    });

    it("should return correct level after earning XP", () => {
      useGameStore.getState().awardXP(500);
      const level = useGameStore.getState().getCurrentLevel();
      expect(level.level).toBe(4);
      expect(level.tier).toBe("Silver");
    });
  });

  describe("reset", () => {
    it("should reset all game state", () => {
      useGameStore.getState().awardXP(100);
      useGameStore.getState().incrementStat("listsCreated", 5);
      useGameStore.getState().updateStreak();

      useGameStore.getState().reset();

      const state = useGameStore.getState();
      expect(state.totalXP).toBe(0);
      expect(state.currentStreak).toBe(0);
      expect(state.longestStreak).toBe(0);
      expect(state.stats.listsCreated).toBe(0);
      expect(state.achievements).toHaveLength(0);
    });
  });
});
