// SAMPLE QUESTION BANK. These 25 items exist so the product flow and the test
// pipeline can run end to end. They are not the normed 150-item bank the PRD
// requires and must be replaced before launch.

export const SKILLS = ["patterns", "numbers", "spatial", "verbal", "memory"] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, string> = {
  patterns: "Patterns",
  numbers: "Number series",
  spatial: "Spatial",
  verbal: "Verbal",
  memory: "Memory",
};

export interface Question {
  id: string;
  skill: Skill;
  prompt: string;
  /** Shown for `ms` milliseconds, then hidden, before the options appear. */
  memorize?: { text: string; ms: number };
  options: string[];
  /** Index into `options`. Never sent to the browser. */
  answer: number;
}

export type PublicQuestion = Omit<Question, "answer">;

const q = (
  id: string,
  skill: Skill,
  prompt: string,
  options: string[],
  answer: number,
  memorize?: Question["memorize"],
): Question => ({ id, skill, prompt, options, answer, ...(memorize ? { memorize } : {}) });

export const QUESTIONS: readonly Question[] = [
  q("p1", "patterns", "What comes next?  ▲ ● ▲ ● ▲ ?", ["▲", "●", "■", "◆"], 1),
  q("p2", "patterns", "What comes next?  ■ ■ ● ■ ■ ● ■ ■ ?", ["■", "▲", "●", "◆"], 2),
  q("p3", "patterns", "What comes next?  ↑ → ↓ ← ↑ ?", ["→", "↓", "←", "↑"], 0),
  q("p4", "patterns", "What comes next?  ● ●● ●●● ●●●● ?", ["●●●", "●●●●", "●●●●●●", "●●●●●"], 3),
  q("p5", "patterns", "What comes next?  ▲■ ■● ●▲ ▲■ ■● ?", ["▲■", "●▲", "■●", "●■"], 1),

  q("n1", "numbers", "What comes next?  2, 4, 6, 8, ?", ["9", "12", "10", "16"], 2),
  q("n2", "numbers", "What comes next?  3, 6, 12, 24, ?", ["48", "36", "30", "27"], 0),
  q("n3", "numbers", "What comes next?  1, 4, 9, 16, ?", ["20", "24", "32", "25"], 3),
  q("n4", "numbers", "What comes next?  2, 3, 5, 8, 13, ?", ["18", "21", "20", "26"], 1),
  q("n5", "numbers", "What comes next?  81, 27, 9, 3, ?", ["0", "2", "1", "6"], 2),

  q("s1", "spatial", "You face north. You turn right, then right again. Which way do you face?", ["East", "West", "North", "South"], 3),
  q("s2", "spatial", "A sheet of paper is folded in half once and one hole is punched through both layers. How many holes when it is unfolded?", ["1", "2", "3", "4"], 1),
  q("s3", "spatial", "Which letter looks the same in a mirror held beside it?", ["A", "F", "G", "R"], 0),
  q("s4", "spatial", "A clock shows 3:00. The whole clock is turned a quarter turn clockwise. Where does the hour hand point now?", ["Up", "Left", "Down", "Right"], 2),
  q("s5", "spatial", "How many small cubes make up a 3 by 3 by 3 cube?", ["9", "18", "27", "36"], 2),

  q("v1", "verbal", "Glove is to hand as sock is to …", ["shoe", "foot", "leg", "wool"], 1),
  q("v2", "verbal", "Hot is to cold as early is to …", ["late", "soon", "morning", "quick"], 0),
  q("v3", "verbal", "Which word does not belong?", ["apple", "pear", "plum", "carrot"], 3),
  q("v4", "verbal", "Author is to book as composer is to …", ["piano", "orchestra", "symphony", "concert"], 2),
  q("v5", "verbal", "Which word is closest in meaning to scarce?", ["rare", "frightening", "small", "sharp"], 0),

  q("m1", "memory", "Which sequence did you see?", ["7 2 4 9", "7 9 2 4", "7 2 9 4", "2 7 9 4"], 2, { text: "7 2 9 4", ms: 2500 }),
  q("m2", "memory", "Which sequence did you see?", ["K T M B R", "K M T B R", "T K M B R", "K T M R B"], 0, { text: "K T M B R", ms: 2500 }),
  q("m3", "memory", "Which word was not in the list?", ["river", "chair", "table", "seven"], 2, { text: "blue · chair · river · seven", ms: 3000 }),
  q("m4", "memory", "What was the fourth number?", ["1", "5", "8", "6"], 3, { text: "3 8 1 6 5 2", ms: 3000 }),
  q("m5", "memory", "How many circles were there?", ["2", "3", "4", "5"], 1, { text: "▲ ● ■ ● ▲ ■ ●", ms: 3000 }),
];

export const QUESTION_COUNT = QUESTIONS.length;

const byId = new Map(QUESTIONS.map((item) => [item.id, item]));

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}

/** Strips the answer key. This is the only form that may leave the server. */
export function toPublic(question: Question): PublicQuestion {
  const { answer: _answer, ...rest } = question;
  return rest;
}
