import {
  getCompletionPercent,
  getMasteredCount,
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

describe("listsStore", () => {
  beforeEach(() => {
    useListsStore.getState().reset();
  });

  describe("addList", () => {
    it("should add a list", () => {
      const list = createMockList();
      useListsStore.getState().addList(list);
      expect(useListsStore.getState().lists).toHaveLength(1);
      expect(useListsStore.getState().lists[0].id).toBe(list.id);
    });

    it("should add multiple lists", () => {
      useListsStore.getState().addList(createMockList());
      useListsStore.getState().addList(createMockList());
      expect(useListsStore.getState().lists).toHaveLength(2);
    });
  });

  describe("deleteList", () => {
    it("should delete a list by id", () => {
      const list = createMockList({ id: "to-delete" });
      useListsStore.getState().addList(list);
      expect(useListsStore.getState().lists).toHaveLength(1);

      useListsStore.getState().deleteList("to-delete");
      expect(useListsStore.getState().lists).toHaveLength(0);
    });

    it("should not affect other lists", () => {
      const list1 = createMockList({ id: "keep" });
      const list2 = createMockList({ id: "delete" });
      useListsStore.getState().addList(list1);
      useListsStore.getState().addList(list2);

      useListsStore.getState().deleteList("delete");
      expect(useListsStore.getState().lists).toHaveLength(1);
      expect(useListsStore.getState().lists[0].id).toBe("keep");
    });
  });

  describe("updateList", () => {
    it("should update list properties", () => {
      const list = createMockList({ id: "update-me" });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateList("update-me", { name: "Updated" });
      expect(useListsStore.getState().lists[0].name).toBe("Updated");
    });
  });

  describe("hasListFromSource", () => {
    it("should return false when no explore lists exist", () => {
      expect(useListsStore.getState().hasListFromSource("pre-1")).toBe(false);
    });

    it("should return true when explore list exists with matching sourceId", () => {
      const list = createMockList({
        source: "explore",
        sourceId: "pre-1",
      });
      useListsStore.getState().addList(list);
      expect(useListsStore.getState().hasListFromSource("pre-1")).toBe(true);
    });
  });

  describe("updateWordProgress", () => {
    it("should increment timesCorrect on correct answer", () => {
      const word = createMockWord({ id: "w1" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(1);
      expect(updated.timesWrong).toBe(0);
    });

    it("should increment timesWrong on incorrect answer", () => {
      const word = createMockWord({ id: "w1" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "incorrect");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.timesCorrect).toBe(0);
      expect(updated.timesWrong).toBe(1);
    });

    it("should transition from not_started to learned on first correct", () => {
      const word = createMockWord({ id: "w1", status: "not_started" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.status).toBe("learned");
    });

    it("should transition to learning on incorrect from not_started", () => {
      const word = createMockWord({ id: "w1", status: "not_started" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "incorrect");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.status).toBe("learning");
    });

    it("should transition to mastered after 5 correct answers", () => {
      const word = createMockWord({
        id: "w1",
        status: "learned",
        timesCorrect: 4,
      });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0].words[0];
      expect(updated.status).toBe("mastered");
      expect(updated.timesCorrect).toBe(5);
    });

    it("should set lastStudiedAt on list after word progress update", () => {
      const word = createMockWord({ id: "w1" });
      const list = createMockList({ id: "l1", words: [word] });
      useListsStore.getState().addList(list);

      useListsStore.getState().updateWordProgress("l1", "w1", "correct");

      const updated = useListsStore.getState().lists[0];
      expect(updated.lastStudiedAt).toBeDefined();
    });
  });

  describe("reset", () => {
    it("should clear all lists", () => {
      useListsStore.getState().addList(createMockList());
      useListsStore.getState().addList(createMockList());
      expect(useListsStore.getState().lists).toHaveLength(2);

      useListsStore.getState().reset();
      expect(useListsStore.getState().lists).toHaveLength(0);
    });
  });
});

describe("getCompletionPercent", () => {
  it("should return 0 for empty words", () => {
    const list = createMockList({ words: [] });
    expect(getCompletionPercent(list)).toBe(0);
  });

  it("should return 0 when no words are learned", () => {
    const list = createMockList({
      words: [
        createMockWord({ status: "not_started" }),
        createMockWord({ status: "learning" }),
      ],
    });
    expect(getCompletionPercent(list)).toBe(0);
  });

  it("should return 100 when all words are mastered", () => {
    const list = createMockList({
      words: [
        createMockWord({ status: "mastered" }),
        createMockWord({ status: "mastered" }),
      ],
    });
    expect(getCompletionPercent(list)).toBe(100);
  });

  it("should return 50 when half are learned", () => {
    const list = createMockList({
      words: [
        createMockWord({ status: "learned" }),
        createMockWord({ status: "not_started" }),
      ],
    });
    expect(getCompletionPercent(list)).toBe(50);
  });
});

describe("getMasteredCount", () => {
  it("should return 0 when no words are mastered", () => {
    const list = createMockList({
      words: [
        createMockWord({ status: "learned" }),
        createMockWord({ status: "learning" }),
      ],
    });
    expect(getMasteredCount(list)).toBe(0);
  });

  it("should count only mastered words", () => {
    const list = createMockList({
      words: [
        createMockWord({ status: "mastered" }),
        createMockWord({ status: "learned" }),
        createMockWord({ status: "mastered" }),
      ],
    });
    expect(getMasteredCount(list)).toBe(2);
  });
});
