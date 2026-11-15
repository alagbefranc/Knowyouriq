export interface Streak {
  current: number;
  longest: number;
  /** Last day a session was completed, as YYYY-MM-DD. */
  lastDay: string | null;
  freezes: number;
}

export const MAX_FREEZES = 2;
export const NEW_STREAK: Streak = { current: 0, longest: 0, lastDay: null, freezes: 0 };

const dayNumber = (day: string) => {
  const ms = Date.parse(`${day}T00:00:00Z`);
  if (Number.isNaN(ms)) throw new RangeError(`invalid day: ${day}`);
  return Math.round(ms / 86_400_000);
};

/**
 * Records a completed daily session. A second session the same day changes
 * nothing; a single missed day is covered by a freeze if one is held; a
 * freeze is earned every 7th day of a streak, up to MAX_FREEZES.
 */
export function recordSession(streak: Streak, day: string): Streak {
  const today = dayNumber(day);
  if (streak.lastDay !== null) {
    const gap = today - dayNumber(streak.lastDay);
    if (gap < 0) throw new RangeError("day is before the last recorded session");
    if (gap === 0) return streak;
    if (gap === 1) return grow(streak, day, streak.freezes);
    if (gap === 2 && streak.freezes > 0) return grow(streak, day, streak.freezes - 1);
  }
  return { current: 1, longest: Math.max(streak.longest, 1), lastDay: day, freezes: streak.freezes };
}

function grow(streak: Streak, day: string, freezes: number): Streak {
  const current = streak.current + 1;
  const earned = current % 7 === 0 ? 1 : 0;
  return {
    current,
    longest: Math.max(streak.longest, current),
    lastDay: day,
    freezes: Math.min(MAX_FREEZES, freezes + earned),
  };
}
