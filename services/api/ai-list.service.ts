import type { VocabWord } from "@/store/listsStore";
import { supabase } from "@/utils/supabase";

export interface AIListRequest {
  topic: string;
  language: string;
  wordCount: number;
  description?: string;
}

export interface AIListResponse {
  name: string;
  topic: string;
  words: VocabWord[];
}

/**
 * Calls the Supabase Edge Function `generate-vocabulary-list` to produce an
 * AI-generated vocabulary list based on the provided parameters.
 */
export async function generateAIList(
  request: AIListRequest,
): Promise<AIListResponse> {
  const { data, error } = await supabase.functions.invoke(
    "generate-vocabulary-list",
    {
      body: {
        topic: request.topic,
        language: request.language,
        wordCount: request.wordCount,
        description: request.description ?? "",
      },
    },
  );

  if (error) {
    throw new Error(error.message ?? "Failed to generate vocabulary list");
  }

  if (!data || !Array.isArray(data.words)) {
    throw new Error("Invalid response from AI service");
  }

  const words: VocabWord[] = data.words.map(
    (
      w: {
        term?: string;
        translation?: string;
        example?: string;
        difficulty?: string;
        partOfSpeech?: string;
      },
      idx: number,
    ) => ({
      id: `ai-${Date.now()}-${idx}`,
      term: w.term ?? "",
      translation: w.translation ?? "",
      example: w.example ?? "",
      difficulty: w.difficulty ?? "beginner",
      partOfSpeech: w.partOfSpeech ?? "word",
      status: "not_started" as const,
      timesCorrect: 0,
      timesWrong: 0,
    }),
  );

  return {
    name: data.name ?? request.topic,
    topic: data.topic ?? request.topic,
    words,
  };
}
