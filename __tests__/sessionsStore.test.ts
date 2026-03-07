import { type LearningSession, useSessionsStore } from "@/store/sessionsStore";

function createMockSession(
  overrides: Partial<LearningSession> = {},
): LearningSession {
  return {
    id: `session-${Math.random().toString(36).slice(2)}`,
    listId: "list-1",
    mode: "flashcard",
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    xpEarned: 10,
    wordsReviewed: 5,
    correctAnswers: 3,
    duration: 120,
    ...overrides,
  };
}

describe("sessionsStore", () => {
  beforeEach(() => {
    useSessionsStore.getState().reset();
  });

  describe("addSession", () => {
    it("should add a session", () => {
      const session = createMockSession();
      useSessionsStore.getState().addSession(session);
      expect(useSessionsStore.getState().sessions).toHaveLength(1);
    });

    it("should add multiple sessions", () => {
      useSessionsStore.getState().addSession(createMockSession());
      useSessionsStore.getState().addSession(createMockSession());
      expect(useSessionsStore.getState().sessions).toHaveLength(2);
    });
  });

  describe("getSessionsByListId", () => {
    it("should return sessions for a specific list", () => {
      useSessionsStore
        .getState()
        .addSession(createMockSession({ listId: "list-a" }));
      useSessionsStore
        .getState()
        .addSession(createMockSession({ listId: "list-b" }));
      useSessionsStore
        .getState()
        .addSession(createMockSession({ listId: "list-a" }));

      const sessions = useSessionsStore
        .getState()
        .getSessionsByListId("list-a");
      expect(sessions).toHaveLength(2);
    });

    it("should return empty array for non-existent list", () => {
      const sessions = useSessionsStore
        .getState()
        .getSessionsByListId("non-existent");
      expect(sessions).toHaveLength(0);
    });
  });

  describe("getSessionsToday", () => {
    it("should return sessions completed today", () => {
      const today = new Date().toISOString();
      useSessionsStore
        .getState()
        .addSession(createMockSession({ completedAt: today }));

      const sessions = useSessionsStore.getState().getSessionsToday();
      expect(sessions).toHaveLength(1);
    });

    it("should not return sessions from yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      useSessionsStore
        .getState()
        .addSession(
          createMockSession({ completedAt: yesterday.toISOString() }),
        );

      const sessions = useSessionsStore.getState().getSessionsToday();
      expect(sessions).toHaveLength(0);
    });

    it("should not return incomplete sessions", () => {
      useSessionsStore
        .getState()
        .addSession(createMockSession({ completedAt: undefined }));

      const sessions = useSessionsStore.getState().getSessionsToday();
      expect(sessions).toHaveLength(0);
    });
  });

  describe("getSessionsThisWeek", () => {
    it("should return sessions from the past 7 days", () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      useSessionsStore
        .getState()
        .addSession(
          createMockSession({ completedAt: threeDaysAgo.toISOString() }),
        );
      useSessionsStore
        .getState()
        .addSession(
          createMockSession({ completedAt: new Date().toISOString() }),
        );

      const sessions = useSessionsStore.getState().getSessionsThisWeek();
      expect(sessions).toHaveLength(2);
    });

    it("should not return sessions from more than 7 days ago", () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      useSessionsStore
        .getState()
        .addSession(
          createMockSession({ completedAt: twoWeeksAgo.toISOString() }),
        );

      const sessions = useSessionsStore.getState().getSessionsThisWeek();
      expect(sessions).toHaveLength(0);
    });
  });

  describe("getTotalStudyTime", () => {
    it("should return 0 with no sessions", () => {
      expect(useSessionsStore.getState().getTotalStudyTime()).toBe(0);
    });

    it("should sum up all session durations", () => {
      useSessionsStore
        .getState()
        .addSession(createMockSession({ duration: 60 }));
      useSessionsStore
        .getState()
        .addSession(createMockSession({ duration: 120 }));

      expect(useSessionsStore.getState().getTotalStudyTime()).toBe(180);
    });
  });

  describe("reset", () => {
    it("should clear all sessions", () => {
      useSessionsStore.getState().addSession(createMockSession());
      useSessionsStore.getState().addSession(createMockSession());
      expect(useSessionsStore.getState().sessions).toHaveLength(2);

      useSessionsStore.getState().reset();
      expect(useSessionsStore.getState().sessions).toHaveLength(0);
    });
  });
});
