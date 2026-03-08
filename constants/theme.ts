/**
 * VocabifyX Design System — Speaker UI Kit Tokens
 * Extracted from Figma: Speaker — Language Learning App | Mobile UI Kit
 */
export const Theme = {
  // ─── Backgrounds ─────────────────────────────────────────────────────────
  background: "#FFFFFF",
  /** Cards, input fields, chip backgrounds, table rows */
  surface: "#F8F8F8",
  /** Highlight cards, active chip background, info items */
  surfacePrimary: "#E5F2FF",

  // ─── Brand ───────────────────────────────────────────────────────────────
  /** Buttons, active states, progress fills, links */
  primary: "#007AFF",

  // ─── Text ────────────────────────────────────────────────────────────────
  /** Main body text */
  textPrimary: "#131313",
  /** Muted / secondary text, right-side values */
  textSecondary: "#D7D7D7",
  /** Text placed on top of a primary-blue background */
  textOnPrimary: "#FFFFFF",

  // ─── Semantic ────────────────────────────────────────────────────────────
  error: "#D53F36",
  success: "#38AD49",

  /** Thin dividers, table-row separators */
  divider: "#F2F2F2",

  // ─── Gamification accent (kept from VocabifyX brand) ─────────────────────
  /** XP / streak / achievement highlights */
  xpAccent: "#F5A623",
} as const;
