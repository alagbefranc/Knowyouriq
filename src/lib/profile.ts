import { SKILLS, type Skill } from "./questions";
import { totalScore, type SectionScores } from "./scoring";

export const PROFILES = {
  "all-rounder": { name: "All-Rounder", blurb: "Your skills sit close together. You adapt to whatever the puzzle asks." },
  "quick-thinker": { name: "Quick Thinker", blurb: "You answer fast and stay accurate. You trust your first read." },
  strategist: { name: "Strategist", blurb: "Patterns and numbers are equally strong for you. You see the rule, then apply it." },
  "pattern-hunter": { name: "Pattern Hunter", blurb: "You spot what repeats and what breaks the rule." },
  "number-whiz": { name: "Number Whiz", blurb: "Sequences and quantities come naturally to you." },
  navigator: { name: "Navigator", blurb: "You turn shapes and directions around in your head with ease." },
  wordsmith: { name: "Wordsmith", blurb: "You see how words and ideas relate." },
  "memory-keeper": { name: "Memory Keeper", blurb: "You hold on to what you have just seen." },
} as const;

export type ProfileId = keyof typeof PROFILES;

const BY_SKILL: Record<Skill, ProfileId> = {
  patterns: "pattern-hunter",
  numbers: "number-whiz",
  spatial: "navigator",
  verbal: "wordsmith",
  memory: "memory-keeper",
};

export const FAST_MS = 8000;

/**
 * Picks a cognitive-style profile. Profiles are for fun and labelled that way.
 * Precedence: All-Rounder, Quick Thinker, Strategist, then the strongest skill.
 */
export function profileFor(sections: SectionScores, averageAnswerMs: number): ProfileId {
  const values = SKILLS.map((s) => sections[s]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max - min <= 1) return "all-rounder";

  const accuracy = totalScore(sections) / (SKILLS.length * 5);
  if (averageAnswerMs > 0 && averageAnswerMs < FAST_MS && accuracy >= 0.6) return "quick-thinker";

  const top = SKILLS.filter((s) => sections[s] === max);
  if (top.length === 2 && top.includes("patterns") && top.includes("numbers")) return "strategist";

  return BY_SKILL[top[0] as Skill];
}
