# VocabifyX – AI List Generation

> **Reference:** [Architecture](./03-app-architecture.md) · [Features](./04-features.md)

---

## Overview

The AI list generation is the **core differentiator** of VocabifyX. Users provide a topic and context; we return a structured, ready-to-learn vocabulary list. All AI calls go through a **Supabase Edge Function** to keep keys server-side and allow model swapping without app updates.

---

## User Input Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `topic` | string | ✅ | e.g. "Germany Travel", "Machine Learning" |
| `topicCategory` | enum | ✅ | Predefined categories (Travel, Economy, Tech…) |
| `description` | string | ❌ | 300–500 chars, adds context for accuracy |
| `wordCount` | 15 \| 30 \| 50 | ✅ | Default: 15 |
| `listLanguage` | string | ✅ | **Default: device locale language.** Shown as a dropdown with all supported languages. AI generates the `term` field in this language. |
| `nativeLanguage` | TR \| EN | ✅ | Auto-filled from user profile; used for the `translation` field |

---

## Prompt Strategy

### System Prompt (static, stored in Edge Function)

```
You are VocabifyX, an AI vocabulary assistant. Your job is to generate 
precise, contextually accurate vocabulary lists for learners.

Rules:
- Return ONLY valid JSON. No markdown, no explanation.
- Words must be relevant to the topic and appropriate for the learner.
- Include practical, commonly-used vocabulary.
- Difficulty levels: beginner / intermediate / advanced
- Output schema: { words: [{term, translation, example, difficulty, partOfSpeech}] }
```

### User Prompt (dynamic, built in app)

```
Generate a vocabulary list for someone learning about: "{topic}"
Topic category: {topicCategory}
{?description: Additional context: "{description}"}
Number of words: {wordCount}
The vocabulary terms ("term" field) MUST be in: {listLanguage}
Translate each term into: {nativeLanguage} ("translation" field)
The example sentence should also be written in {listLanguage}.

Return exactly {wordCount} unique, relevant vocabulary items.
```

### How `listLanguage` is selected

- **Default on create list screen:** auto-detected from device locale (same as app language)
- **User can change** via a dropdown picker on the Create List screen
- **Supported languages:** English, Turkish, German, French, Spanish, Italian, Portuguese, Dutch, Russian, Japanese, Chinese (Simplified), Arabic — expandable at any time via Edge Function update, no app release required
- The selected `listLanguage` is passed as a plain language name (e.g. `"German"`) in the prompt so the model understands it directly

---

## Response Schema (Zod)

```typescript
const WordSchema = z.object({
  term: z.string(),           // Word in listLanguage
  translation: z.string(),    // Word in nativeLanguage
  example: z.string(),        // Example sentence using the term
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb', 'phrase', 'other']),
})

const GeneratedListSchema = z.object({
  words: z.array(WordSchema).min(1).max(50),
})
```

---

## Edge Function: `/generate-vocab-list`

**Runtime:** Deno (Supabase Edge Functions)

```typescript
// Pseudo-code structure
Deno.serve(async (req) => {
  // 1. Authenticate request (check app secret header)
  // 2. Parse & validate request body (Zod)
  // 3. Build system + user prompt
  // 4. Call AI API (OpenAI gpt-4o-mini / Gemini flash)
  // 5. Validate response schema (Zod)
  // 6. Return structured JSON
  // 7. Log usage metrics to Supabase DB table `ai_usage_logs`
})
```

**Environment Variables:**
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `APP_SECRET` (shared secret, set in Firebase Remote Config per app version)
- `ACTIVE_MODEL`: `openai` | `gemini` (switchable via Remote Config)

---

## Model Selection Strategy

| Model | Use Case | Cost | Speed |
|-------|----------|------|-------|
| `gpt-4o-mini` | Default – great accuracy + speed | Low | Fast |
| `gemini-2.0-flash` | Fallback / A/B test | Very low | Fast |
| `gpt-4o` | Long descriptions, complex topics | Medium | Medium |

Remote Config key `ai_model` controls which model is active. Can switch between models without app update.

---

## Error Handling

| Error | User Message | Action |
|-------|-------------|--------|
| Network error | "Check your connection and try again" | Retry button |
| AI timeout (>10s) | "Taking longer than usual, try again" | Retry, log to Crashlytics |
| Invalid AI response | "Something went wrong generating your list" | Retry, log to Crashlytics |
| Rate limit | "Too many requests, please wait a moment" | Back-off (30s) |

---

## Analytics Events

```typescript
track('list_generation_started', { topic, topicCategory, wordCount, listLanguage })
track('list_generation_succeeded', { topic, wordCount, modelUsed, durationMs })
track('list_generation_failed', { topic, errorType, modelUsed })
```

---

## Future: AI List Extension (Post-MVP)

After MVP, users can tap "Extend this list" on any existing list to:
1. AI generates 10–20 more related words
2. Deduplication check against existing words
3. User reviews and accepts/rejects suggestions
