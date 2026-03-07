import {
  getLevelDisplayName,
  getLevelForXP,
  getXPForNextLevel,
  LEVELS,
} from "@/constants/levels";

describe("levels", () => {
  describe("LEVELS constant", () => {
    it("should have 16 levels", () => {
      expect(LEVELS).toHaveLength(16);
    });

    it("should have ascending XP requirements", () => {
      for (let i = 1; i < LEVELS.length; i++) {
        expect(LEVELS[i].xpRequired).toBeGreaterThan(LEVELS[i - 1].xpRequired);
      }
    });

    it("should start with Bronze tier at level 1", () => {
      expect(LEVELS[0].tier).toBe("Bronze");
      expect(LEVELS[0].level).toBe(1);
      expect(LEVELS[0].xpRequired).toBe(0);
    });

    it("should end with Legend tier at level 16", () => {
      const last = LEVELS[LEVELS.length - 1];
      expect(last.tier).toBe("Legend");
      expect(last.level).toBe(16);
      expect(last.xpRequired).toBe(50000);
    });
  });

  describe("getLevelForXP", () => {
    it("should return level 1 for 0 XP", () => {
      const level = getLevelForXP(0);
      expect(level.level).toBe(1);
      expect(level.tier).toBe("Bronze");
    });

    it("should return level 2 for 100 XP", () => {
      const level = getLevelForXP(100);
      expect(level.level).toBe(2);
    });

    it("should return level 2 for 150 XP (between levels)", () => {
      const level = getLevelForXP(150);
      expect(level.level).toBe(2);
    });

    it("should return Silver tier for 500 XP", () => {
      const level = getLevelForXP(500);
      expect(level.tier).toBe("Silver");
      expect(level.level).toBe(4);
    });

    it("should return Gold tier for 1800 XP", () => {
      const level = getLevelForXP(1800);
      expect(level.tier).toBe("Gold");
    });

    it("should return Legend for 50000+ XP", () => {
      const level = getLevelForXP(99999);
      expect(level.tier).toBe("Legend");
      expect(level.level).toBe(16);
    });
  });

  describe("getXPForNextLevel", () => {
    it("should return correct progress at 0 XP", () => {
      const result = getXPForNextLevel(0);
      expect(result.currentXP).toBe(0);
      expect(result.nextLevelXP).toBe(100);
      expect(result.progress).toBe(0);
    });

    it("should return 50% progress at 50 XP (halfway to level 2)", () => {
      const result = getXPForNextLevel(50);
      expect(result.currentXP).toBe(50);
      expect(result.nextLevelXP).toBe(100);
      expect(result.progress).toBe(0.5);
    });

    it("should return progress of 1 at max level", () => {
      const result = getXPForNextLevel(99999);
      expect(result.progress).toBe(1);
    });

    it("should calculate mid-level progress correctly", () => {
      // Level 4 starts at 500, Level 5 at 800. At 650 XP: (650-500)/(800-500) = 150/300 = 0.5
      const result = getXPForNextLevel(650);
      expect(result.currentXP).toBe(150);
      expect(result.nextLevelXP).toBe(300);
      expect(result.progress).toBe(0.5);
    });
  });

  describe("getLevelDisplayName", () => {
    it("should format Bronze level correctly", () => {
      expect(getLevelDisplayName(LEVELS[0])).toBe("Bronze · Lv.1");
    });

    it("should format Silver level correctly", () => {
      expect(getLevelDisplayName(LEVELS[3])).toBe("Silver · Lv.1");
    });

    it("should return Legend for the last level", () => {
      expect(getLevelDisplayName(LEVELS[LEVELS.length - 1])).toBe("Legend");
    });
  });
});
