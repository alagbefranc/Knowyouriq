import { describe, expect, it } from "vitest";
import { levelForXp, xpForLevel, xpForRound } from "@/lib/xp";

describe("xpForRound", () => {
  it("gives 10 XP just for finishing", () => {
    expect(xpForRound({ correct: 0, total: 5, difficulty: 3 })).toBe(10);
  });
  it("adds more for correct answers at higher difficulty", () => {
    expect(xpForRound({ correct: 5, total: 5, difficulty: 1 })).toBe(20);
    expect(xpForRound({ correct: 5, total: 5, difficulty: 5 })).toBe(60);
  });
  it("rejects impossible rounds", () => {
    expect(() => xpForRound({ correct: 6, total: 5, difficulty: 1 })).toThrow(RangeError);
    expect(() => xpForRound({ correct: 1, total: 0, difficulty: 1 })).toThrow(RangeError);
    expect(() => xpForRound({ correct: 1, total: 5, difficulty: 6 })).toThrow(RangeError);
  });
});

describe("levels", () => {
  it("needs 0, 100, 300, 600 XP for levels 1 to 4", () => {
    expect([1, 2, 3, 4].map(xpForLevel)).toEqual([0, 100, 300, 600]);
  });
  it("finds the level for an XP total, including exact thresholds", () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(599)).toBe(3);
    expect(levelForXp(600)).toBe(4);
  });
  it("rejects negative XP and level 0", () => {
    expect(() => levelForXp(-1)).toThrow(RangeError);
    expect(() => xpForLevel(0)).toThrow(RangeError);
  });
});
