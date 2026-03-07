import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

export interface LearningSession {
  id: string;
  listId: string;
  mode: "flashcard" | "quiz";
  startedAt: string;
  completedAt?: string;
  xpEarned: number;
  wordsReviewed: number;
  correctAnswers: number;
  duration: number;
}

interface SessionsState {
  sessions: LearningSession[];
  addSession: (session: LearningSession) => void;
  getSessionsByListId: (listId: string) => LearningSession[];
  getSessionsToday: () => LearningSession[];
  getSessionsThisWeek: () => LearningSession[];
  getTotalStudyTime: () => number;
  reset: () => void;
}

function isDateInRange(dateStr: string, startDate: Date): boolean {
  const date = new Date(dateStr);
  return date >= startDate;
}

const initialState = {
  sessions: [] as LearningSession[],
};

export const useSessionsStore = create<SessionsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      getSessionsByListId: (listId) => {
        return get().sessions.filter((s) => s.listId === listId);
      },

      getSessionsToday: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return get().sessions.filter(
          (s) => s.completedAt && isDateInRange(s.completedAt, today),
        );
      },

      getSessionsThisWeek: () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        return get().sessions.filter(
          (s) => s.completedAt && isDateInRange(s.completedAt, weekAgo),
        );
      },

      getTotalStudyTime: () => {
        return get().sessions.reduce((total, s) => total + s.duration, 0);
      },

      reset: () => set(initialState),
    }),
    {
      name: "vocabifyx-sessions",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
