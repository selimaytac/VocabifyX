import { useGameStore } from "@/store/gameStore";
import {
  useListsStore,
  type UserVocabList,
  type VocabWord,
} from "@/store/listsStore";

function createMockWord(overrides: Partial<VocabWord> = {}): VocabWord {
  return {
    id: `word-${Math.random().toString(36).slice(2)}`,
    term: "test",
    translation: "test translation",
    example: "test example",
    difficulty: "beginner",
    partOfSpeech: "noun",
    status: "not_started",
    timesCorrect: 0,
    timesWrong: 0,
    ...overrides,
  };
}

function createMockList(overrides: Partial<UserVocabList> = {}): UserVocabList {
  return {
    id: `list-${Math.random().toString(36).slice(2)}`,
    name: "Test List",
    topic: "Testing",
    topicCategory: "technology",
    listLanguage: "English",
    wordCount: 3,
    source: "ai_generated",
    createdAt: new Date().toISOString(),
    words: [createMockWord(), createMockWord(), createMockWord()],
    ...overrides,
  };
}

describe("listsStore – word status transitions (extended)", () => {
  beforeEach(() => {
    useListsStore.getState().reset();
  });

  describe("learning → learned transition", () => {
    it("should remain learning after first correct when status is learning", () => {
      const word = createMockWord({
        id: "w1",
        status: "learning",
        timesCorrect: 0,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(1);
      expect(updated.status).toBe("learning");
    });

    it("should transition from learning to learned after 2 correct answers", () => {
      const word = createMockWord({
        id: "w1",
        status: "learning",
        timesCorrect: 1,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(2);
      expect(updated.status).toBe("learned");
    });

    it("should keep learned status on incorrect answer", () => {
      const word = createMockWord({
        id: "w1",
        status: "learned",
        timesCorrect: 2,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "incorrect");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesWrong).toBe(1);
      expect(updated.status).toBe("learned");
    });
  });

  describe("mastery progression", () => {
    it("should not transition to mastered before 5 correct answers", () => {
      const word = createMockWord({
        id: "w1",
        status: "learned",
        timesCorrect: 3,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(4);
      expect(updated.status).toBe("learned");
    });

    it("should stay mastered on additional correct answers", () => {
      const word = createMockWord({
        id: "w1",
        status: "mastered",
        timesCorrect: 6,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(7);
      expect(updated.status).toBe("mastered");
    });

    it("should set lastStudied on word after progress update", () => {
      const word = createMockWord({ id: "w1" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      const before = Date.now();
      useListsStore.getState().updateWordProgress("l1", "w1", "correct");
      const after = Date.now();

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.lastStudied).toBeDefined();
      const lastStudiedTs = new Date(updated.lastStudied!).getTime();
      expect(lastStudiedTs).toBeGreaterThanOrEqual(before);
      expect(lastStudiedTs).toBeLessThanOrEqual(after);
    });
  });

  describe("wordsMastered stat integration", () => {
    it("should count mastered words correctly after multiple updates", () => {
      const words = [
        createMockWord({ id: "w1", status: "learned", timesCorrect: 4 }),
        createMockWord({ id: "w2", status: "learned", timesCorrect: 4 }),
        createMockWord({ id: "w3", status: "not_started", timesCorrect: 0 }),
      ];
      const list = createMockList({ id: "l1", words });
      useListsStore.getState().addList(list);

      const initialMastered = useListsStore
        .getState()
        .lists[0].words.filter((w) => w.status === "mastered").length;
      expect(initialMastered).toBe(0);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");
      useListsStore.getState().updateWordProgress("l1", "w2", "correct");

      const newMastered = useListsStore
        .getState()
        .lists[0].words.filter((w) => w.status === "mastered").length;
      expect(newMastered).toBe(2);
    });

    it("should not count mastered words that were already mastered before the session", () => {
      const words = [
        createMockWord({ id: "w1", status: "mastered", timesCorrect: 6 }),
        createMockWord({ id: "w2", status: "learned", timesCorrect: 4 }),
      ];
      const list = createMockList({ id: "l1", words });
      useListsStore.getState().addList(list);

      const initialMastered = useListsStore
        .getState()
        .lists[0].words.filter((w) => w.status === "mastered").length;
      expect(initialMastered).toBe(1);

      useListsStore.getState().updateWordProgress("l1", "w2", "correct");

      const newMastered = useListsStore
        .getState()
        .lists[0].words.filter((w) => w.status === "mastered").length;
      const newlyMastered = newMastered - initialMastered;
      expect(newlyMastered).toBe(1);
    });
  });

  describe("gameStore wordsMastered stat", () => {
    beforeEach(() => {
      useGameStore.getState().reset();
    });

    it("should start with wordsMastered stat at 0", () => {
      expect(useGameStore.getState().stats.wordsMastered).toBe(0);
    });

    it("should increment wordsMastered via incrementStat", () => {
      useGameStore.getState().incrementStat("wordsMastered", 3);
      expect(useGameStore.getState().stats.wordsMastered).toBe(3);
    });

    it("should unlock words_50 achievement after 50 wordsMastered", () => {
      useGameStore.getState().incrementStat("wordsMastered", 50);
      const unlocked = useGameStore.getState().checkAndUnlockAchievements();
      expect(unlocked.some((a) => a.id === "words_50")).toBe(true);
    });

    it("should not unlock words_50 achievement before reaching 50 wordsMastered", () => {
      useGameStore.getState().incrementStat("wordsMastered", 49);
      const unlocked = useGameStore.getState().checkAndUnlockAchievements();
      expect(unlocked.some((a) => a.id === "words_50")).toBe(false);
    });
  });
});
