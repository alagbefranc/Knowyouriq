import { QUESTIONS, SKILLS, type Skill } from "./questions";

export type SectionScores = Record<Skill, number>;

/**
 * PROVISIONAL norm. Real values come from the pre-launch norming panel
 * (500+ adults); until then these are assumptions, not measurements.
 */
export const NORM = { mean: 12.5, sd: 4.5 } as const;
export const SCORE_MIN = 70;
export const SCORE_MAX = 140;
export const MARGIN = 6;

export interface Estimate {
  raw: number;
  estimate: number;
  low: number;
  high: number;
  percentile: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Counts correct answers per skill. Unanswered or unknown questions score 0. */
export function scoreSections(answers: Readonly<Record<string, number>>): SectionScores {
  const scores = Object.fromEntries(SKILLS.map((s) => [s, 0])) as SectionScores;
  for (const question of QUESTIONS) {
    if (answers[question.id] === question.answer) scores[question.skill] += 1;
  }
  return scores;
}

export function totalScore(sections: SectionScores): number {
  return SKILLS.reduce((sum, s) => sum + sections[s], 0);
}

/** Standard normal cumulative distribution (Abramowitz & Stegun 7.1.26). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-(z * z) / 2);
  return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
}

/** Converts a raw score (0..25) to the scaled estimate shown to the user. */
export function estimateFromRaw(raw: number): Estimate {
  if (!Number.isInteger(raw) || raw < 0 || raw > QUESTIONS.length) {
    throw new RangeError(`raw score must be an integer from 0 to ${QUESTIONS.length}`);
  }
  const z = (raw - NORM.mean) / NORM.sd;
  const estimate = clamp(Math.round(100 + 15 * z), SCORE_MIN, SCORE_MAX);
  const percentile = clamp(Math.round(normalCdf((estimate - 100) / 15) * 100), 1, 99);
  return {
    raw,
    estimate,
    low: clamp(estimate - MARGIN, SCORE_MIN, SCORE_MAX),
    high: clamp(estimate + MARGIN, SCORE_MIN, SCORE_MAX),
    percentile,
  };
}

/** Highest-scoring skill. Ties resolve in the fixed SKILLS order. */
export function strongestSkill(sections: SectionScores): Skill {
  return SKILLS.reduce((best, s) => (sections[s] > sections[best] ? s : best), SKILLS[0]);
}

/** The `count` lowest-scoring skills, weakest first. Ties resolve in SKILLS order. */
export function weakestSkills(sections: SectionScores, count = 2): Skill[] {
  return [...SKILLS].sort((a, b) => sections[a] - sections[b]).slice(0, count);
}
