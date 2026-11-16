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

/**
 * Visual tokens. A prompt sequence, a memorise set and an option are lists of
 * tokens the UI draws; anything that is not a token is shown as plain text.
 *   "img:ball"       a picture from /art/sprites
 *   "img:key@90"     the same picture turned 90 degrees clockwise
 *   "img:key@90m"    mirrored, then turned (a different shape, not a rotation)
 *   "img:ball*3"     three of the picture as one group
 *   "w:glove"        a picture with its name written under it
 *   "n:16"           a number tile
 *   "?"              the missing piece
 */
export type Token = string;

export interface Question {
  id: string;
  skill: Skill;
  prompt: string;
  /** Pictures or number tiles shown under the prompt. */
  sequence?: Token[];
  /** Shown for `ms` milliseconds, then hidden, before the options appear. */
  memorize?: { items: Token[]; ms: number };
  /** Each option is one token or plain text. */
  options: string[];
  /** Index into `options`. Never sent to the browser. */
  answer: number;
}

export type PublicQuestion = Omit<Question, "answer">;

type Extra = Pick<Question, "sequence" | "memorize">;
const q = (id: string, skill: Skill, prompt: string, options: string[], answer: number, extra: Extra = {}): Question => ({
  id, skill, prompt, options, answer, ...extra,
});
const seq = (...tokens: Token[]): Extra => ({ sequence: tokens });
const img = (...names: string[]) => names.map((n) => `img:${n}`);
const named = (...names: string[]) => names.map((n) => `w:${n}`);
const nums = (...values: number[]) => values.map((v) => `n:${v}`);
/** How long a memory set stays on screen. The player can move on sooner. */
export const MEMORISE_MS = 20_000;
const NEXT = "What comes next?";
const TURNED = "Which one is the same toy, only turned?";

export const QUESTIONS: readonly Question[] = [
  q("p1", "patterns", NEXT, img("star", "ball", "cube", "gem"), 1, seq(...img("cube", "ball", "cube", "ball", "cube"), "?")),
  q("p2", "patterns", NEXT, img("gem", "pyramid", "star", "donut"), 2, seq(...img("gem", "gem", "star", "gem", "gem", "star", "gem", "gem"), "?")),
  q("p3", "patterns", NEXT, img("arrow@90", "arrow@180", "arrow@270", "arrow@0"), 0, seq(...img("arrow@0", "arrow@90", "arrow@180", "arrow@270", "arrow@0"), "?")),
  q("p4", "patterns", NEXT, img("ball*3", "ball*4", "ball*6", "ball*5"), 3, seq(...img("ball*1", "ball*2", "ball*3", "ball*4"), "?")),
  q("p5", "patterns", NEXT, img("cube", "donut", "pyramid", "star"), 1, seq(...img("pyramid", "donut", "donut", "pyramid", "donut", "donut", "pyramid", "donut"), "?")),

  q("n1", "numbers", NEXT, nums(9, 12, 10, 16), 2, seq(...nums(2, 4, 6, 8), "?")),
  q("n2", "numbers", NEXT, nums(48, 36, 30, 27), 0, seq(...nums(3, 6, 12, 24), "?")),
  q("n3", "numbers", NEXT, nums(20, 24, 32, 25), 3, seq(...nums(1, 4, 9, 16), "?")),
  q("n4", "numbers", NEXT, nums(18, 21, 20, 26), 1, seq(...nums(2, 3, 5, 8, 13), "?")),
  q("n5", "numbers", NEXT, nums(0, 2, 1, 6), 2, seq(...nums(81, 27, 9, 3), "?")),

  // Rotation items: exactly one option is the picture turned; the others are mirror images.
  q("s1", "spatial", TURNED, img("key@90m", "key@180m", "key@270m", "key@90"), 3, seq("img:key")),
  q("s2", "spatial", TURNED, img("duck@270m", "duck@180", "duck@90m", "duck@0m"), 1, seq("img:duck")),
  q("s3", "spatial", TURNED, img("can@270", "can@90m", "can@180m", "can@0m"), 0, seq("img:can")),
  q("s4", "spatial", "The arrow makes a quarter turn clockwise, twice. Where does it point?", img("arrow@0", "arrow@270", "arrow@180", "arrow@90"), 2, seq("img:arrow@0")),
  q("s5", "spatial", "Which arrow points the opposite way?", img("arrow@0", "arrow@270", "arrow@180", "arrow@90"), 1, seq("img:arrow@90")),

  // Word reasoning, shown as named pictures: analogies and odd-one-out.
  q("v1", "verbal", "Finish the pair", named("shoe", "foot", "hat", "hand"), 1, seq("w:glove", "is to", "w:hand", "as", "w:sock", "is to", "?")),
  q("v2", "verbal", "Finish the pair", named("ice", "candle", "tree", "flower"), 0, seq("w:sun", "is to", "w:moon", "as", "w:fire", "is to", "?")),
  q("v3", "verbal", "Which one does not belong?", named("apple", "pear", "cherry", "carrot"), 3),
  q("v4", "verbal", "Finish the pair", named("flower", "web", "hive", "tree"), 2, seq("w:bird", "is to", "w:nest", "as", "w:bee", "is to", "?")),
  q("v5", "verbal", "Which one does not belong?", named("spoon", "hammer", "saw", "wrench"), 0),

  q("m1", "memory", "Which one was not there?", img("ball", "star", "gem", "cube"), 2, { memorize: { items: img("star", "cube", "ball", "donut"), ms: MEMORISE_MS } }),
  q("m2", "memory", "Which came first?", img("pyramid", "gem", "donut", "star"), 0, { memorize: { items: img("pyramid", "gem", "donut", "star", "ball"), ms: MEMORISE_MS } }),
  q("m3", "memory", "How many gems were there?", nums(1, 2, 3, 4), 2, { memorize: { items: img("gem", "ball", "gem", "cube", "duck", "gem"), ms: MEMORISE_MS } }),
  q("m4", "memory", "What was the fourth number?", nums(1, 5, 8, 6), 3, { memorize: { items: nums(3, 8, 1, 6, 5, 2), ms: MEMORISE_MS } }),
  q("m5", "memory", "Which one came right after the duck?", img("key", "can", "ball", "cube"), 1, { memorize: { items: img("key", "duck", "can", "ball", "cube"), ms: MEMORISE_MS } }),
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
