import { describe, expect, it } from "vitest";
import { profileFor, PROFILES } from "@/lib/profile";

const SLOW = 20_000;

describe("profileFor", () => {
  it("is All-Rounder when skills are within one point", () => {
    expect(profileFor({ patterns: 3, numbers: 3, spatial: 4, verbal: 3, memory: 4 }, SLOW)).toBe("all-rounder");
  });
  it("is Quick Thinker for fast, accurate, uneven results", () => {
    expect(profileFor({ patterns: 5, numbers: 5, spatial: 2, verbal: 4, memory: 3 }, 5000)).toBe("quick-thinker");
  });
  it("does not reward speed without accuracy", () => {
    expect(profileFor({ patterns: 3, numbers: 1, spatial: 0, verbal: 1, memory: 1 }, 2000)).toBe("pattern-hunter");
  });
  it("is Strategist when patterns and numbers tie for top", () => {
    expect(profileFor({ patterns: 5, numbers: 5, spatial: 2, verbal: 3, memory: 1 }, SLOW)).toBe("strategist");
  });
  it.each([
    [{ patterns: 5, numbers: 2, spatial: 1, verbal: 2, memory: 1 }, "pattern-hunter"],
    [{ patterns: 1, numbers: 5, spatial: 1, verbal: 2, memory: 1 }, "number-whiz"],
    [{ patterns: 1, numbers: 2, spatial: 5, verbal: 2, memory: 1 }, "navigator"],
    [{ patterns: 1, numbers: 2, spatial: 1, verbal: 5, memory: 1 }, "wordsmith"],
    [{ patterns: 1, numbers: 2, spatial: 1, verbal: 2, memory: 5 }, "memory-keeper"],
  ] as const)("follows the strongest skill: %o -> %s", (sections, expected) => {
    expect(profileFor(sections, SLOW)).toBe(expected);
  });
  it("has a name and description for every profile", () => {
    expect(Object.keys(PROFILES)).toHaveLength(8);
    for (const p of Object.values(PROFILES)) {
      expect(p.name.length).toBeGreaterThan(3);
      expect(p.blurb.length).toBeGreaterThan(20);
    }
  });
});
