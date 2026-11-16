import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/lib/questions";
import { estimateFromRaw, normalCdf, scoreSections, strongestSkill, totalScore, weakestSkills } from "@/lib/scoring";

const allCorrect = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.answer]));

describe("scoreSections", () => {
  it("gives 5 per skill when every answer is right", () => {
    expect(scoreSections(allCorrect)).toEqual({ patterns: 5, numbers: 5, spatial: 5, verbal: 5, memory: 5 });
  });
  it("gives 0 everywhere for no answers", () => {
    expect(totalScore(scoreSections({}))).toBe(0);
  });
  it("counts a wrong answer as 0 and ignores unknown question ids", () => {
    const answers = { ...allCorrect, p1: (QUESTIONS[0]!.answer + 1) % 4, zz9: 0 };
    const sections = scoreSections(answers);
    expect(sections.patterns).toBe(4);
    expect(totalScore(sections)).toBe(24);
  });
});

describe("estimateFromRaw", () => {
  it("maps an average raw score to about 100", () => {
    expect(estimateFromRaw(12).estimate).toBe(98);
    expect(estimateFromRaw(13).estimate).toBe(102);
  });
  it("clamps to the displayable range of 70 to 140", () => {
    expect(estimateFromRaw(0).estimate).toBe(70);
    expect(estimateFromRaw(25).estimate).toBe(140);
  });
  it("never decreases as the raw score rises", () => {
    let previous = 0;
    for (let raw = 0; raw <= 25; raw += 1) {
      const { estimate } = estimateFromRaw(raw);
      expect(estimate).toBeGreaterThanOrEqual(previous);
      previous = estimate;
    }
  });
  it("always reports a range around the estimate and a percentile from 1 to 99", () => {
    for (let raw = 0; raw <= 25; raw += 1) {
      const e = estimateFromRaw(raw);
      expect(e.low).toBeLessThanOrEqual(e.estimate);
      expect(e.high).toBeGreaterThanOrEqual(e.estimate);
      expect(e.low).toBeGreaterThanOrEqual(70);
      expect(e.high).toBeLessThanOrEqual(140);
      expect(e.percentile).toBeGreaterThanOrEqual(1);
      expect(e.percentile).toBeLessThanOrEqual(99);
    }
  });
  it("rejects impossible raw scores", () => {
    expect(() => estimateFromRaw(-1)).toThrow(RangeError);
    expect(() => estimateFromRaw(26)).toThrow(RangeError);
    expect(() => estimateFromRaw(3.5)).toThrow(RangeError);
  });
});

describe("normalCdf", () => {
  it("matches known values", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 4);
    expect(normalCdf(1)).toBeCloseTo(0.8413, 3);
    expect(normalCdf(-1.96)).toBeCloseTo(0.025, 3);
  });
});

describe("strongest and weakest skills", () => {
  const sections = { patterns: 3, numbers: 5, spatial: 1, verbal: 5, memory: 2 };
  it("picks the highest skill, first in fixed order on a tie", () => {
    expect(strongestSkill(sections)).toBe("numbers");
  });
  it("lists the two weakest, weakest first", () => {
    expect(weakestSkills(sections)).toEqual(["spatial", "memory"]);
  });
});
