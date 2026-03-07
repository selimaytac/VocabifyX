# VocabifyX – GitHub Copilot Instructions

## Project Overview

VocabifyX is a **React Native / Expo** vocabulary-learning app. Users build personal word lists (via AI generation or curated explore packs), then study them through flashcard and quiz sessions. Gamification (XP, streaks, achievements, levels) keeps users engaged.

**Stack:** Expo 55 · React Native 0.83 · TypeScript · Tamagui UI · Zustand · TanStack Query · Lingui i18n · Supabase · RevenueCat · Amplitude

---

## Architecture

```
app/               expo-router file-based navigation
  (auth)/          unauthenticated stack (login, onboarding)
  (tabs)/          main tab bar (Home, Explore, Profile)
  session/         learning session screens (flashcard, quiz, summary)
  settings/        settings stack
components/
  DesignSystem/    Tamagui-based design primitives
store/             Zustand stores (persisted via AsyncStorage)
constants/         static data (achievements, levels, predefined lists)
services/          external integrations (analytics, API client)
hooks/             shared React hooks
locales/           Lingui i18n message catalogues (en, tr)
utils/             pure utilities
__tests__/         Jest unit tests
```

---

## Code Style & Conventions

### TypeScript
- Strict mode is enabled. Always provide explicit types for function parameters and return values.
- Prefer `interface` over `type` for object shapes; use `type` for unions and aliases.
- Never use `any`. Use `unknown` when the type cannot be known statically.
- Export types/interfaces that are used across multiple files.

### React & Components
- All components are **functional components** with named exports.
- Keep components focused and small (< 150 lines). Extract sub-components when a component grows too large.
- Co-locate component-specific types with the component file.
- Avoid inline styles; use Tamagui tokens and styled components instead.
- Follow the `no-array-index-key` rule — always use stable, unique IDs as React keys.

### Tamagui UI
- Use design system primitives from `@/components/DesignSystem/` (Button, Card, Typography, etc.) rather than raw Tamagui or RN components.
- Use Tamagui spacing tokens (`$1`–`$8`) for padding/margin. Never hardcode pixel values.
- Use semantic color tokens (`$blue10`, `$gray11`, `$background`, `$colorSubtitle`) — never hardcode hex values in component files.
- Use `styled()` to create component variants; avoid prop-drilling inline styles.

### Zustand Stores
- Each domain has one store file in `store/`. Keep business logic in the store, not in components.
- Use `persist` middleware with `createZustandStorage` from `@/utils/zustand.utils` for AsyncStorage persistence.
- Export an `initialState` constant and a `reset()` action in every store (required for testing).
- Store functions that compute derived data should be plain selectors (not `useXxx` hooks) when used outside React.

### Navigation (Expo Router)
- Use file-based routing. Add new screens as files under `app/`.
- Use typed `useRouter` / `useLocalSearchParams` from `expo-router`.
- Pass route params via search params (strings only); resolve complex objects from the store using the ID.
- Register new route groups in the root `app/_layout.tsx` `<Stack>`.

### i18n (Lingui)
- **All user-visible strings** must use i18n keys — never hardcode English text in components.
- Add keys to both `locales/en/messages.ts` and `locales/tr/messages.ts` simultaneously.
- Key naming convention: `<screen>.<element>` (e.g., `session.knewIt`, `quiz.correctAnswer`).
- Retrieve translations with `const { i18n } = useLingui(); i18n._("key")`.

### Analytics
- Track meaningful user actions via `analyticsService.track()` from `@/services/analytics/analytics.service`.
- Standard event names use snake_case (e.g., `session_completed`, `achievement_unlocked`).

---

## State Management Patterns

```ts
// Reading state – use selector for fine-grained subscriptions
const lists = useListsStore((state) => state.lists);

// Calling actions – destructure from getState() in non-React code / tests
useGameStore.getState().awardXP(50);

// Zustand store template
export const useXxxStore = create<XxxState>()(
  persist(
    (set, get) => ({
      ...initialState,
      someAction: () => set((state) => ({ ... })),
      reset: () => set(initialState),
    }),
    { name: "vocabifyx-xxx", storage: createJSONStorage(createZustandStorage) },
  ),
);
```

---

## Testing

- Tests live in `__tests__/` and use **Jest** with the `jest-expo` preset.
- Run all tests: `npx jest --ci`
- Test Zustand stores by calling `store.getState().reset()` in `beforeEach`.
- Test pure utility/constant functions directly (no mocking required).
- Mock `@react-native-async-storage/async-storage` is configured globally in `jest.setup.js`.
- Do **not** use `any` in test files; create typed mock factory functions (e.g., `createMockSession()`).

---

## Linting & Formatting

- Run lint: `npm run lint` (ESLint)
- Auto-fix: `npm run lint:fix`
- Type check: `npm run type` (tsc --noEmit)
- Key rules enforced:
  - `simple-import-sort` – imports must be sorted and grouped automatically
  - `import/no-duplicates` – no duplicate import statements
  - `react/no-array-index-key` – stable keys required
  - `no-console` – only `console.warn/error/info/debug` allowed
  - `prettier/prettier` – consistent formatting

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `store/gameStore.ts` | XP, streaks, achievements, level tracking |
| `store/listsStore.ts` | User vocab lists + word progress |
| `store/sessionsStore.ts` | Study session history |
| `store/userStore.ts` | User profile + onboarding state |
| `constants/achievements.ts` | 14 achievement definitions |
| `constants/levels.ts` | 16 level / tier definitions |
| `constants/predefined-lists.ts` | Curated explore lists (EN + TR) |
| `services/analytics/analytics.service.ts` | Amplitude analytics wrapper |
| `hooks/useAuth.tsx` | Supabase auth hook |
| `hooks/useSubscription.tsx` | RevenueCat entitlement hook |
| `utils/zustand.utils.ts` | AsyncStorage adapter for Zustand |

---

## Common Patterns to Follow

### Starting a learning session
```ts
// 1. Get words from the store by listId
const list = useListsStore.getState().lists.find(l => l.id === listId);
// 2. Run session logic, tracking correct/incorrect per word
// 3. Call updateWordProgress after each answer
useListsStore.getState().updateWordProgress(listId, wordId, "correct");
// 4. On session complete: updateStreak → awardXP → incrementStat → checkAndUnlockAchievements
useGameStore.getState().updateStreak();
useGameStore.getState().awardXP(xpEarned);
useGameStore.getState().incrementStat("sessionsCompleted");
useGameStore.getState().checkAndUnlockAchievements();
// 5. Persist session to sessionsStore
useSessionsStore.getState().addSession(session);
```

### Adding a new screen
1. Create the file under the appropriate `app/` group.
2. Register the route in the parent `_layout.tsx` if it uses a Stack.
3. Add all strings to both `locales/en/messages.ts` and `locales/tr/messages.ts`.
4. Use only design system components from `@/components/DesignSystem/`.

### Word progress status machine
```
not_started → learned    (first correct answer)
not_started → learning   (first incorrect answer)
learned     → mastered   (timesCorrect >= 5)
```
