import { describe, expect, it } from "vitest";
import { getQuestion, QUESTIONS, SKILLS, toPublic } from "@/lib/questions";

describe("question bank", () => {
  it("has 25 questions, 5 per skill, in section order", () => {
    expect(QUESTIONS).toHaveLength(25);
    for (const skill of SKILLS) expect(QUESTIONS.filter((q) => q.skill === skill)).toHaveLength(5);
    expect(QUESTIONS.map((q) => q.skill)).toEqual(SKILLS.flatMap((s) => Array(5).fill(s)));
  });
  it("has unique ids and a valid answer index for every question", () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(25);
    for (const q of QUESTIONS) {
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
  it("does not always put the right answer in the same position", () => {
    expect(new Set(QUESTIONS.map((q) => q.answer)).size).toBeGreaterThanOrEqual(3);
  });
  it("strips the answer key from the public form", () => {
    for (const q of QUESTIONS) expect(toPublic(q)).not.toHaveProperty("answer");
    expect(JSON.stringify(QUESTIONS.map(toPublic))).not.toContain('"answer"');
  });
  it("looks questions up by id", () => {
    expect(getQuestion("n3")?.prompt).toContain("1, 4, 9, 16");
    expect(getQuestion("nope")).toBeUndefined();
  });
});
