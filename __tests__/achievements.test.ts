import { ACHIEVEMENTS, getAchievementById } from "@/constants/achievements";

describe("achievements", () => {
  describe("ACHIEVEMENTS constant", () => {
    it("should have 14 achievements", () => {
      expect(ACHIEVEMENTS).toHaveLength(14);
    });

    it("should have unique IDs", () => {
      const ids = ACHIEVEMENTS.map((a) => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("should have positive XP rewards", () => {
      for (const achievement of ACHIEVEMENTS) {
        expect(achievement.xpReward).toBeGreaterThan(0);
      }
    });

    it("should have valid condition types", () => {
      const validTypes = [
        "lists_created",
        "words_mastered",
        "sessions_completed",
        "streak_days",
        "lists_completed",
        "explore_added",
        "quiz_perfect",
        "level_reached",
      ];
      for (const achievement of ACHIEVEMENTS) {
        expect(validTypes).toContain(achievement.condition.type);
      }
    });
  });

  describe("getAchievementById", () => {
    it("should find existing achievements", () => {
      const newbie = getAchievementById("newbie");
      expect(newbie).toBeDefined();
      expect(newbie?.id).toBe("newbie");
      expect(newbie?.xpReward).toBe(10);
    });

    it("should return undefined for non-existent achievement", () => {
      expect(getAchievementById("non_existent")).toBeUndefined();
    });

    it("should find all achievements by their IDs", () => {
      for (const achievement of ACHIEVEMENTS) {
        const found = getAchievementById(achievement.id);
        expect(found).toBe(achievement);
      }
    });
  });
});
