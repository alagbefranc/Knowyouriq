export interface Round {
  correct: number;
  total: number;
  /** 1 (easiest) to 5 (hardest). */
  difficulty: number;
}

/** 10 XP for finishing a round, plus 2 XP per correct answer per difficulty step. */
export function xpForRound(round: Round): number {
  const { correct, total, difficulty } = round;
  if (total <= 0 || correct < 0 || correct > total) throw new RangeError("invalid round");
  if (difficulty < 1 || difficulty > 5) throw new RangeError("difficulty must be 1 to 5");
  return 10 + correct * 2 * difficulty;
}

/** XP needed to reach a level: 0, 100, 300, 600, 1000 … */
export function xpForLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) throw new RangeError("level starts at 1");
  return 50 * level * (level - 1);
}

export function levelForXp(xp: number): number {
  if (xp < 0) throw new RangeError("xp cannot be negative");
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  return level;
}
