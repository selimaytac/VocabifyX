import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createZustandStorage } from "@/utils/zustand.utils";

export type WordStatus = "not_started" | "learning" | "learned" | "mastered";

export interface VocabWord {
  id: string;
  term: string;
  translation: string;
  example: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  partOfSpeech: string;
  status: WordStatus;
  timesCorrect: number;
  timesWrong: number;
  lastStudied?: string;
  nextReview?: string;
}

export interface UserVocabList {
  id: string;
  name: string;
  topic: string;
  topicCategory: string;
  description?: string;
  listLanguage: string;
  wordCount: number;
  source: "ai_generated" | "explore" | "manual";
  sourceId?: string;
  createdAt: string;
  lastStudiedAt?: string;
  words: VocabWord[];
}

export function getCompletionPercent(list: UserVocabList): number {
  if (list.words.length === 0) return 0;
  const learnedOrMastered = list.words.filter(
    (w) => w.status === "learned" || w.status === "mastered",
  ).length;
  return Math.round((learnedOrMastered / list.words.length) * 100);
}

export function getMasteredCount(list: UserVocabList): number {
  return list.words.filter((w) => w.status === "mastered").length;
}

interface ListsState {
  lists: UserVocabList[];
  addList: (list: UserVocabList) => void;
  updateList: (id: string, updates: Partial<UserVocabList>) => void;
  deleteList: (id: string) => void;
  hasListFromSource: (sourceId: string) => boolean;
  updateWordProgress: (
    listId: string,
    wordId: string,
    result: "correct" | "incorrect",
  ) => void;
  reset: () => void;
}

function getNextWordStatus(
  currentStatus: WordStatus,
  result: "correct" | "incorrect",
  timesCorrect: number,
): WordStatus {
  if (result === "incorrect") {
    return currentStatus === "not_started" ? "learning" : currentStatus;
  }

  // correct answer
  if (timesCorrect >= 5) return "mastered";
  if (timesCorrect >= 2) return "learned";
  return currentStatus === "not_started" ? "learned" : currentStatus;
}

const initialState = {
  lists: [] as UserVocabList[],
};

export const useListsStore = create<ListsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addList: (list) =>
        set((state) => ({
          lists: [...state.lists, list],
        })),

      updateList: (id, updates) =>
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list,
          ),
        })),

      deleteList: (id) =>
        set((state) => ({
          lists: state.lists.filter((list) => list.id !== id),
        })),

      hasListFromSource: (sourceId) => {
        return get().lists.some(
          (list) => list.source === "explore" && list.sourceId === sourceId,
        );
      },

      updateWordProgress: (listId, wordId, result) =>
        set((state) => ({
          lists: state.lists.map((list) => {
            if (list.id !== listId) return list;
            return {
              ...list,
              lastStudiedAt: new Date().toISOString(),
              words: list.words.map((word) => {
                if (word.id !== wordId) return word;
                const newTimesCorrect =
                  result === "correct"
                    ? word.timesCorrect + 1
                    : word.timesCorrect;
                const newTimesWrong =
                  result === "incorrect"
                    ? word.timesWrong + 1
                    : word.timesWrong;
                return {
                  ...word,
                  timesCorrect: newTimesCorrect,
                  timesWrong: newTimesWrong,
                  status: getNextWordStatus(
                    word.status,
                    result,
                    newTimesCorrect,
                  ),
                  lastStudied: new Date().toISOString(),
                };
              }),
            };
          }),
        })),

      reset: () => set(initialState),
    }),
    {
      name: "vocabifyx-lists",
      storage: createJSONStorage(createZustandStorage),
    },
  ),
);
