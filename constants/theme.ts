/**
 * VocabifyX Design System — Adapted from Happit Design Reference
 * Color palette, gradients, shadows, and spacing tokens.
 */
export const Theme = {
  // ─── Primary Brand Colors ────────────────────────────────────────────────
  /** Dark navy — primary buttons, headers, active tab indicators */
  primary: "#213448",
  primaryLight: "#3A4366",
  primaryDark: "#050A1A",

  /** Steel blue — gradient end, accent */
  secondary: "#547792",

  /** Coral/salmon — secondary buttons, highlights */
  accent: "#E17564",
  accentLight: "#E99B8E",
  accentDark: "#C94F3F",

  /** Red — danger actions, logout, delete */
  danger: "#BE3144",
  dangerLight: "#D15A6A",
  dangerDark: "#8A232F",

  // ─── Backgrounds ─────────────────────────────────────────────────────────
  /** Light mode main background */
  background: "#FFFFFF",
  /** Cards, input fields, chip backgrounds, table rows */
  surface: "#F7F8FB",
  /** Highlight cards, active chip background, info items */
  surfacePrimary: "#E5F2FF",

  // ─── Text ────────────────────────────────────────────────────────────────
  /** Main body text — dark navy */
  textPrimary: "#09122C",
  /** Muted / secondary text */
  textSecondary: "#777777",
  /** Disabled / placeholder text */
  textDisabled: "#B0B0B0",
  /** Text placed on primary-colored background */
  textOnPrimary: "#FFFFFF",
  /** Link / "View All" text — purple */
  textLink: "#653FFD",

  // ─── Semantic ────────────────────────────────────────────────────────────
  error: "#F44336",
  errorLight: "#F6685E",
  errorDark: "#C62828",
  success: "#4CAF50",
  successLight: "#81C784",
  successDark: "#388E3C",
  warning: "#FFC107",
  warningLight: "#FFCA28",
  warningDark: "#FFA000",
  info: "#2196F3",
  infoLight: "#64B5F6",
  infoDark: "#1976D2",

  // ─── Neutral ─────────────────────────────────────────────────────────────
  white: "#FFFFFF",
  offWhite: "#F7F8FB",
  lightGray: "#E0E0E0",
  mediumGray: "#B0B0B0",
  darkGray: "#777777",
  black: "#000000",

  /** Thin dividers, table-row separators */
  divider: "#E0E0E0",
  /** Selected-state border (near black) */
  borderSelected: "#050A1A",

  // ─── Gamification accent ─────────────────────────────────────────────────
  /** Selection gold — selected cards, recommended badges */
  gold: "#FFB400",
  /** XP / streak / achievement highlights */
  xpAccent: "#F5A623",
  /** Badge/link purple */
  purple: "#653FFD",

  // ─── Action Colors ───────────────────────────────────────────────────────
  deleteRed: "#FF5A5F",
  doneGreen: "#3BA935",
  undoOrange: "#FF9800",
  streakOrange: "#FF9800",
  medalGold: "#f4a261",

  // ─── Gradient Definitions ────────────────────────────────────────────────
  gradientCTA: ["#547792", "#213448"] as readonly [string, string],
  gradientAddBtn: ["#213448", "#547792"] as readonly [string, string],
  gradientModal: ["#E8F0F5", "#D8E6F0", "#C8DCE8"] as readonly [
    string,
    string,
    string,
  ],

  // ─── Rank Gradients ──────────────────────────────────────────────────────
  rankBronze: ["#CD7F32", "#A0522D"] as readonly [string, string],
  rankSilver: ["#C0C0C0", "#808080"] as readonly [string, string],
  rankGold: ["#FFD700", "#DAA520"] as readonly [string, string],
  rankPlatinum: ["#E5E4E2", "#B0B0B0"] as readonly [string, string],
  rankDiamond: ["#B9F2FF", "#4DD0E1"] as readonly [string, string],

  // ─── Card-specific colors ────────────────────────────────────────────────
  tipCardBg: "#F8F9FC",
  tipCardIconBg: "#E8ECF2",
  habitGreenBg: "#E3F6E3",
  habitGreen: "#2F9E65",

  // ─── Dark Mode Overrides ─────────────────────────────────────────────────
  darkBackground: "#1C2526",
  darkSurface: "#2A3435",
  darkBorder: "#B0B0B0",
} as const;

/** Shadow presets matching design reference */
export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardMedium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  nav: {
    shadowColor: "#CDCDD0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
} as const;
