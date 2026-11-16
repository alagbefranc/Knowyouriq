import {
  advanceSubscription,
  cancelSubscription,
  createSubscription,
  hasAccess,
  nextCharge,
  validateCheckout,
  type Subscription,
} from "./billing";
import { AppError } from "./errors";
import { profileFor } from "./profile";
import { getQuestion, QUESTIONS, toPublic, type PublicQuestion } from "./questions";
import { estimateFromRaw, scoreSections, strongestSkill, totalScore, weakestSkills } from "./scoring";
import { defaultStore, type Attempt, type AttemptResult, type Store } from "./store";

export interface Deps {
  store?: Store;
  now?: Date;
  /** "mock" completes checkout without a payment processor. Anything else refuses. */
  paymentsMode?: string;
}

const storeOf = async (deps: Deps) => deps.store ?? (await defaultStore());
const nowOf = (deps: Deps) => deps.now ?? new Date();

async function requireAttempt(id: string, deps: Deps): Promise<Attempt> {
  const attempt = await (await storeOf(deps)).getAttempt(id);
  if (!attempt) throw new AppError(404, "attempt_not_found", "We could not find that test.");
  return attempt;
}

export async function startAttempt(input: { ageConfirmed: unknown }, deps: Deps = {}): Promise<{ id: string }> {
  if (input.ageConfirmed !== true) {
    throw new AppError(400, "age_required", "You must confirm you are 18 or older to take the test.");
  }
  const attempt: Attempt = { id: crypto.randomUUID(), createdAt: nowOf(deps), answers: {} };
  await (await storeOf(deps)).saveAttempt(attempt);
  return { id: attempt.id };
}

export interface AttemptView {
  id: string;
  questions: PublicQuestion[];
  answeredIds: string[];
  completed: boolean;
}

/** What the browser may see of an attempt: questions without answer keys. */
export async function viewAttempt(id: string, deps: Deps = {}): Promise<AttemptView> {
  const attempt = await requireAttempt(id, deps);
  return {
    id: attempt.id,
    questions: QUESTIONS.map(toPublic),
    answeredIds: Object.keys(attempt.answers),
    completed: attempt.completedAt !== undefined,
  };
}

export async function submitAnswer(
  input: { attemptId: string; questionId: unknown; choice: unknown; ms?: unknown },
  deps: Deps = {},
): Promise<{ answered: number }> {
  const attempt = await requireAttempt(input.attemptId, deps);
  if (attempt.completedAt) throw new AppError(409, "attempt_completed", "This test is already finished.");
  const question = typeof input.questionId === "string" ? getQuestion(input.questionId) : undefined;
  if (!question) throw new AppError(400, "unknown_question", "Unknown question.");
  const choice = input.choice;
  if (typeof choice !== "number" || !Number.isInteger(choice) || choice < 0 || choice >= question.options.length) {
    throw new AppError(400, "invalid_choice", "Pick one of the options.");
  }
  // An answer locks on first tap; later submissions for the same question are ignored.
  if (!(question.id in attempt.answers)) {
    const ms = typeof input.ms === "number" && input.ms >= 0 ? Math.round(input.ms) : 0;
    attempt.answers[question.id] = { choice, ms };
    await (await storeOf(deps)).saveAttempt(attempt);
  }
  return { answered: Object.keys(attempt.answers).length };
}

/**
 * Scores the attempt. Unanswered questions count as wrong. Safe to call twice.
 * Nothing about the score is returned: every part of the result is paid.
 */
export async function completeAttempt(id: string, deps: Deps = {}): Promise<{ completed: true }> {
  const attempt = await requireAttempt(id, deps);
  if (!attempt.result) {
    const choices = Object.fromEntries(Object.entries(attempt.answers).map(([qid, a]) => [qid, a.choice]));
    const sections = scoreSections(choices);
    const times = Object.values(attempt.answers).map((a) => a.ms).filter((ms) => ms > 0);
    const averageMs = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    attempt.result = {
      ...estimateFromRaw(totalScore(sections)),
      sections,
      strongest: strongestSkill(sections),
      weakest: weakestSkills(sections),
      profile: profileFor(sections, averageMs),
    };
    attempt.completedAt = nowOf(deps);
    await (await storeOf(deps)).saveAttempt(attempt);
  }
  return { completed: true };
}

/** What the unpaid result screen may know: only how many questions were answered. */
export async function getLockedResult(id: string, deps: Deps = {}): Promise<{ answered: number }> {
  const attempt = await requireAttempt(id, deps);
  if (!attempt.result) throw new AppError(409, "attempt_incomplete", "Finish the test to see your result.");
  return { answered: Object.keys(attempt.answers).length };
}

export async function checkout(input: { attemptId: string; consent: unknown }, deps: Deps = {}): Promise<{ renewsOn: Date }> {
  const attempt = await requireAttempt(input.attemptId, deps);
  if (!attempt.result) throw new AppError(409, "attempt_incomplete", "Finish the test before starting a trial.");
  if (validateCheckout(input).length > 0) {
    throw new AppError(400, "consent_required", "Tick the box to agree to the renewal terms first.");
  }
  if ((deps.paymentsMode ?? process.env.PAYMENTS_MODE) !== "mock") {
    // No payment processor is wired up yet. Refuse rather than grant access unpaid.
    throw new AppError(503, "payments_unavailable", "Payments are not available yet.");
  }
  const now = nowOf(deps);
  if (!hasAccess(attempt.subscription, now)) {
    attempt.subscription = createSubscription(now);
    await (await storeOf(deps)).saveAttempt(attempt);
  }
  return { renewsOn: (attempt.subscription as Subscription).currentPeriodEnd };
}

export interface PlanView {
  status: Subscription["status"];
  cancelled: boolean;
  accessUntil: Date;
  nextCharge: { at: Date; amountCents: number } | null;
}

async function currentSubscription(attempt: Attempt, deps: Deps): Promise<Subscription> {
  if (!attempt.subscription) throw new AppError(402, "subscription_required", "Start a trial to see your full report.");
  const sub = advanceSubscription(attempt.subscription, nowOf(deps));
  if (sub !== attempt.subscription) {
    attempt.subscription = sub;
    await (await storeOf(deps)).saveAttempt(attempt);
  }
  return sub;
}

function planOf(sub: Subscription): PlanView {
  return { status: sub.status, cancelled: sub.cancelAtPeriodEnd, accessUntil: sub.currentPeriodEnd, nextCharge: nextCharge(sub) };
}

export async function getPlan(id: string, deps: Deps = {}): Promise<PlanView> {
  return planOf(await currentSubscription(await requireAttempt(id, deps), deps));
}

/** The paid report. Checked on the server on every request. */
export async function getReport(id: string, deps: Deps = {}): Promise<{ result: AttemptResult; plan: PlanView }> {
  const attempt = await requireAttempt(id, deps);
  if (!attempt.result) throw new AppError(409, "attempt_incomplete", "Finish the test to see your result.");
  const sub = await currentSubscription(attempt, deps);
  if (sub.status === "ended") throw new AppError(402, "subscription_ended", "Your plan has ended.");
  return { result: attempt.result, plan: planOf(sub) };
}

export async function cancelPlan(id: string, deps: Deps = {}): Promise<PlanView> {
  const attempt = await requireAttempt(id, deps);
  const sub = cancelSubscription(await currentSubscription(attempt, deps), nowOf(deps));
  attempt.subscription = sub;
  await (await storeOf(deps)).saveAttempt(attempt);
  return planOf(sub);
}
