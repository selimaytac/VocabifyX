export interface LevelDefinition {
  level: number;
  tier: string;
  tierLevel: number;
  xpRequired: number;
  badgeColor: string;
  emoji: string;
}

export const LEVELS: LevelDefinition[] = [
  {
    level: 1,
    tier: "Bronze",
    tierLevel: 1,
    xpRequired: 0,
    badgeColor: "#CD7F32",
    emoji: "🟤",
  },
  {
    level: 2,
    tier: "Bronze",
    tierLevel: 2,
    xpRequired: 100,
    badgeColor: "#CD7F32",
    emoji: "🟤",
  },
  {
    level: 3,
    tier: "Bronze",
    tierLevel: 3,
    xpRequired: 250,
    badgeColor: "#CD7F32",
    emoji: "🟤",
  },
  {
    level: 4,
    tier: "Silver",
    tierLevel: 1,
    xpRequired: 500,
    badgeColor: "#C0C0C0",
    emoji: "⚪",
  },
  {
    level: 5,
    tier: "Silver",
    tierLevel: 2,
    xpRequired: 800,
    badgeColor: "#C0C0C0",
    emoji: "⚪",
  },
  {
    level: 6,
    tier: "Silver",
    tierLevel: 3,
    xpRequired: 1200,
    badgeColor: "#C0C0C0",
    emoji: "⚪",
  },
  {
    level: 7,
    tier: "Gold",
    tierLevel: 1,
    xpRequired: 1800,
    badgeColor: "#FFD700",
    emoji: "🟡",
  },
  {
    level: 8,
    tier: "Gold",
    tierLevel: 2,
    xpRequired: 2500,
    badgeColor: "#FFD700",
    emoji: "🟡",
  },
  {
    level: 9,
    tier: "Gold",
    tierLevel: 3,
    xpRequired: 3500,
    badgeColor: "#FFD700",
    emoji: "🟡",
  },
  {
    level: 10,
    tier: "Platinum",
    tierLevel: 1,
    xpRequired: 5000,
    badgeColor: "#9B59B6",
    emoji: "💜",
  },
  {
    level: 11,
    tier: "Platinum",
    tierLevel: 2,
    xpRequired: 7000,
    badgeColor: "#9B59B6",
    emoji: "💜",
  },
  {
    level: 12,
    tier: "Platinum",
    tierLevel: 3,
    xpRequired: 10000,
    badgeColor: "#9B59B6",
    emoji: "💜",
  },
  {
    level: 13,
    tier: "Diamond",
    tierLevel: 1,
    xpRequired: 15000,
    badgeColor: "#00CED1",
    emoji: "💎",
  },
  {
    level: 14,
    tier: "Diamond",
    tierLevel: 2,
    xpRequired: 22000,
    badgeColor: "#00CED1",
    emoji: "💎",
  },
  {
    level: 15,
    tier: "Diamond",
    tierLevel: 3,
    xpRequired: 30000,
    badgeColor: "#00CED1",
    emoji: "💎",
  },
  {
    level: 16,
    tier: "Legend",
    tierLevel: 1,
    xpRequired: 50000,
    badgeColor: "#FFD700",
    emoji: "🌟",
  },
];

export function getLevelForXP(totalXP: number): LevelDefinition {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (totalXP >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getXPForNextLevel(totalXP: number): {
  currentXP: number;
  nextLevelXP: number;
  progress: number;
} {
  const currentLevel = getLevelForXP(totalXP);
  const currentIndex = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentIndex + 1];

  if (!nextLevel) {
    return { currentXP: totalXP, nextLevelXP: totalXP, progress: 1 };
  }

  const xpIntoLevel = totalXP - currentLevel.xpRequired;
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired;
  const progress = xpIntoLevel / xpNeeded;

  return {
    currentXP: xpIntoLevel,
    nextLevelXP: xpNeeded,
    progress: Math.min(progress, 1),
  };
}

export function getLevelDisplayName(level: LevelDefinition): string {
  if (level.tier === "Legend") {
    return "Legend";
  }
  return `${level.tier} · Lv.${level.tierLevel}`;
}
