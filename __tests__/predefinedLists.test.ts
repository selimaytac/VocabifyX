import {
  getPredefinedListsByLocale,
  LIST_CATEGORIES,
  type ListCategory,
  PREDEFINED_LISTS_EN,
  PREDEFINED_LISTS_TR,
  type PredefinedList,
} from "@/constants/predefined-lists";

describe("predefined-lists constants", () => {
  describe("LIST_CATEGORIES", () => {
    it("should contain 6 categories", () => {
      expect(LIST_CATEGORIES).toHaveLength(6);
    });

    it('should include "all" as the first category', () => {
      expect(LIST_CATEGORIES[0].key).toBe("all");
    });

    it("should include all expected category keys", () => {
      const keys: ListCategory[] = LIST_CATEGORIES.map((c) => c.key);
      expect(keys).toContain("all");
      expect(keys).toContain("travel");
      expect(keys).toContain("business");
      expect(keys).toContain("technology");
      expect(keys).toContain("daily_life");
      expect(keys).toContain("academic");
    });

    it("should have a labelKey for every category", () => {
      for (const category of LIST_CATEGORIES) {
        expect(typeof category.labelKey).toBe("string");
        expect(category.labelKey.length).toBeGreaterThan(0);
      }
    });
  });

  describe("PREDEFINED_LISTS_EN", () => {
    it("should contain 5 lists", () => {
      expect(PREDEFINED_LISTS_EN).toHaveLength(5);
    });

    it("should have unique list IDs", () => {
      const ids = PREDEFINED_LISTS_EN.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have lists with at least 10 words each", () => {
      for (const list of PREDEFINED_LISTS_EN) {
        expect(list.words.length).toBeGreaterThanOrEqual(10);
      }
    });

    it("should have words with required fields", () => {
      for (const list of PREDEFINED_LISTS_EN) {
        for (const word of list.words) {
          expect(typeof word.id).toBe("string");
          expect(typeof word.term).toBe("string");
          expect(typeof word.translation).toBe("string");
          expect(typeof word.example).toBe("string");
          expect(["beginner", "intermediate", "advanced"]).toContain(
            word.difficulty,
          );
          expect(typeof word.partOfSpeech).toBe("string");
        }
      }
    });

    it("should have unique word IDs within each list", () => {
      for (const list of PREDEFINED_LISTS_EN) {
        const wordIds = list.words.map((w) => w.id);
        expect(new Set(wordIds).size).toBe(wordIds.length);
      }
    });

    it("should only contain English lists", () => {
      for (const list of PREDEFINED_LISTS_EN) {
        expect(list.listLanguage).toBe("English");
      }
    });

    it("should have ids prefixed with pre-en-", () => {
      for (const list of PREDEFINED_LISTS_EN) {
        expect(list.id.startsWith("pre-en-")).toBe(true);
      }
    });

    it("should cover a variety of categories", () => {
      const categories = new Set(
        PREDEFINED_LISTS_EN.map((l) => l.topicCategory),
      );
      expect(categories.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe("PREDEFINED_LISTS_TR", () => {
    it("should contain 5 lists", () => {
      expect(PREDEFINED_LISTS_TR).toHaveLength(5);
    });

    it("should have unique list IDs", () => {
      const ids = PREDEFINED_LISTS_TR.map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("should have lists with at least 10 words each", () => {
      for (const list of PREDEFINED_LISTS_TR) {
        expect(list.words.length).toBeGreaterThanOrEqual(10);
      }
    });

    it("should have ids prefixed with pre-tr-", () => {
      for (const list of PREDEFINED_LISTS_TR) {
        expect(list.id.startsWith("pre-tr-")).toBe(true);
      }
    });

    it("should have no ID overlap with EN lists", () => {
      const enIds = new Set(PREDEFINED_LISTS_EN.map((l) => l.id));
      for (const list of PREDEFINED_LISTS_TR) {
        expect(enIds.has(list.id)).toBe(false);
      }
    });
  });

  describe("getPredefinedListsByLocale", () => {
    it('should return EN lists for "en" locale', () => {
      const lists = getPredefinedListsByLocale("en");
      expect(lists).toBe(PREDEFINED_LISTS_EN);
    });

    it('should return TR lists for "tr" locale', () => {
      const lists = getPredefinedListsByLocale("tr");
      expect(lists).toBe(PREDEFINED_LISTS_TR);
    });

    it("should return non-empty arrays for both locales", () => {
      expect(getPredefinedListsByLocale("en").length).toBeGreaterThan(0);
      expect(getPredefinedListsByLocale("tr").length).toBeGreaterThan(0);
    });

    it("should return lists matching the PredefinedList interface", () => {
      const requiredFields: (keyof PredefinedList)[] = [
        "id",
        "name",
        "topic",
        "topicCategory",
        "description",
        "listLanguage",
        "words",
      ];
      for (const list of getPredefinedListsByLocale("en")) {
        for (const field of requiredFields) {
          expect(list).toHaveProperty(field);
        }
      }
    });
  });
});
