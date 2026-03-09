/* eslint-disable import/first */
// Mock supabase before importing the module
const mockInvoke = jest.fn();
jest.mock("@/utils/supabase", () => ({
  supabase: {
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}));

import type { AIListRequest } from "../services/api/ai-list.service";
import { generateAIList } from "../services/api/ai-list.service";

describe("generateAIList", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
  });

  const validRequest: AIListRequest = {
    topic: "Airport vocabulary",
    language: "English",
    wordCount: 10,
    description: "Common words used at airports",
  };

  it("calls supabase edge function with correct parameters", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        name: "Airport Vocabulary",
        topic: "Airport",
        words: [
          {
            term: "boarding pass",
            translation: "biniş kartı",
            example: "Please show your boarding pass.",
            difficulty: "beginner",
            partOfSpeech: "noun",
          },
        ],
      },
      error: null,
    });

    await generateAIList(validRequest);

    expect(mockInvoke).toHaveBeenCalledWith("generate-vocabulary-list", {
      body: {
        topic: "Airport vocabulary",
        language: "English",
        wordCount: 10,
        description: "Common words used at airports",
      },
    });
  });

  it("returns properly formatted list response", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        name: "Airport Vocabulary",
        topic: "Airport",
        words: [
          {
            term: "boarding pass",
            translation: "biniş kartı",
            example: "Please show your boarding pass.",
            difficulty: "beginner",
            partOfSpeech: "noun",
          },
          {
            term: "terminal",
            translation: "terminal",
            example: "Gate B is in terminal 2.",
            difficulty: "beginner",
            partOfSpeech: "noun",
          },
        ],
      },
      error: null,
    });

    const result = await generateAIList(validRequest);

    expect(result.name).toBe("Airport Vocabulary");
    expect(result.topic).toBe("Airport");
    expect(result.words).toHaveLength(2);
    expect(result.words[0].term).toBe("boarding pass");
    expect(result.words[0].translation).toBe("biniş kartı");
    expect(result.words[0].status).toBe("not_started");
    expect(result.words[0].timesCorrect).toBe(0);
    expect(result.words[0].timesWrong).toBe(0);
    expect(result.words[1].term).toBe("terminal");
  });

  it("throws error when edge function returns an error", async () => {
    mockInvoke.mockResolvedValue({
      data: null,
      error: { message: "Edge function failed" },
    });

    await expect(generateAIList(validRequest)).rejects.toThrow(
      "Edge function failed",
    );
  });

  it("throws error when response has no words array", async () => {
    mockInvoke.mockResolvedValue({
      data: { name: "Test", topic: "Test" },
      error: null,
    });

    await expect(generateAIList(validRequest)).rejects.toThrow(
      "Invalid response from AI service",
    );
  });

  it("sends empty string for description when not provided", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        name: "Test List",
        topic: "Test",
        words: [{ term: "hello", translation: "merhaba" }],
      },
      error: null,
    });

    await generateAIList({
      topic: "Test",
      language: "Turkish",
      wordCount: 10,
    });

    expect(mockInvoke).toHaveBeenCalledWith("generate-vocabulary-list", {
      body: {
        topic: "Test",
        language: "Turkish",
        wordCount: 10,
        description: "",
      },
    });
  });

  it("handles missing word fields with defaults", async () => {
    mockInvoke.mockResolvedValue({
      data: {
        name: "Minimal",
        topic: "Test",
        words: [{ term: "hello" }],
      },
      error: null,
    });

    const result = await generateAIList(validRequest);

    expect(result.words[0].term).toBe("hello");
    expect(result.words[0].translation).toBe("");
    expect(result.words[0].example).toBe("");
    expect(result.words[0].difficulty).toBe("beginner");
    expect(result.words[0].partOfSpeech).toBe("word");
  });
});
