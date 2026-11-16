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
  it("has exactly one true rotation among the options of each rotation item", () => {
    const rotations = QUESTIONS.filter((q) => q.prompt.startsWith("Which one is the same toy"));
    expect(rotations.length).toBeGreaterThanOrEqual(3);
    for (const q of rotations) {
      const unmirrored = q.options.filter((o) => !o.endsWith("m"));
      expect(unmirrored).toEqual([q.options[q.answer]]);
    }
  });
  it("only uses pictures that exist in the sprite set", () => {
    const known = new Set([
      "ball", "cube", "pyramid", "star", "donut", "gem", "arrow", "key", "duck", "can",
      "glove", "hand", "sock", "foot", "shoe", "hat", "sun", "moon", "fire", "ice", "candle", "tree", "flower",
      "apple", "pear", "cherry", "carrot", "bird", "nest", "bee", "hive", "web", "hammer", "saw", "wrench", "spoon",
    ]);
    const tokens = QUESTIONS.flatMap((q) => [...(q.sequence ?? []), ...(q.memorize?.items ?? []), ...q.options]);
    const pictures = tokens.filter((t) => t.startsWith("img:") || t.startsWith("w:"));
    expect(pictures.length).toBeGreaterThan(80);
    for (const token of pictures) {
      expect(known.has(token.slice(token.indexOf(":") + 1).split(/[@*]/)[0]!)).toBe(true);
    }
  });
  it("uses a picture or number tile for every answer option", () => {
    for (const q of QUESTIONS) for (const option of q.options) expect(option).toMatch(/^(img|n|w):/);
  });
  it("gives 20 seconds to memorise every memory set", () => {
    const memory = QUESTIONS.filter((q) => q.memorize);
    expect(memory).toHaveLength(5);
    for (const q of memory) expect(q.memorize!.ms).toBe(20_000);
  });
  it("looks questions up by id", () => {
    expect(getQuestion("n3")?.sequence).toEqual(["n:1", "n:4", "n:9", "n:16", "?"]);
    expect(getQuestion("nope")).toBeUndefined();
  });
});
