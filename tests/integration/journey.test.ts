// Units chained together through the service layer:
// start -> answer -> score -> teaser -> checkout -> report -> cancel -> expiry.
import { beforeEach, describe, expect, it } from "vitest";
import { addDays } from "@/lib/billing";
import { AppError } from "@/lib/errors";
import { QUESTIONS } from "@/lib/questions";
import {
  cancelPlan, checkout, completeAttempt, getLockedResult, getPlan, getReport, startAttempt, submitAnswer, viewAttempt, type Deps,
} from "@/lib/service";
import { MemoryStore } from "@/lib/store";

const T0 = new Date("2026-11-15T10:00:00Z");
let deps: Deps;
const at = (days: number): Deps => ({ ...deps, now: addDays(T0, days) });

async function codeOf(fn: () => Promise<unknown>): Promise<string> {
  try {
    await fn();
  } catch (error) {
    if (error instanceof AppError) return error.code;
    throw error;
  }
  return "no_error";
}

/** Answers every question; the first `correct` of them correctly. */
async function takeTest(correct: number, ms = 12_000): Promise<string> {
  const { id } = await startAttempt({ ageConfirmed: true }, deps);
  for (const [i, q] of QUESTIONS.entries()) {
    const choice = i < correct ? q.answer : (q.answer + 1) % q.options.length;
    await submitAnswer({ attemptId: id, questionId: q.id, choice, ms }, deps);
  }
  return id;
}

beforeEach(() => {
  deps = { store: new MemoryStore(), now: T0, paymentsMode: "mock" };
});

describe("taking the test", () => {
  it("refuses to start without the age confirmation", async () => {
    expect(await codeOf(() => startAttempt({ ageConfirmed: false }, deps))).toBe("age_required");
  });
  it("never exposes answer keys to the browser view", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    const view = await viewAttempt(id, deps);
    expect(view.questions).toHaveLength(25);
    expect(JSON.stringify(view)).not.toContain('"answer"');
  });
  it("locks an answer on first submission and tracks progress for resume", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    const q = QUESTIONS[0]!;
    await submitAnswer({ attemptId: id, questionId: q.id, choice: (q.answer + 1) % 4 }, deps);
    await submitAnswer({ attemptId: id, questionId: q.id, choice: q.answer }, deps);
    expect((await viewAttempt(id, deps)).answeredIds).toEqual([q.id]);
    await completeAttempt(id, deps);
    expect((await getReportAfterPaying(id)).result.sections.patterns).toBe(0);
  });
  it("rejects unknown questions, bad choices and unknown attempts", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    expect(await codeOf(() => submitAnswer({ attemptId: id, questionId: "zz", choice: 0 }, deps))).toBe("unknown_question");
    expect(await codeOf(() => submitAnswer({ attemptId: id, questionId: "p1", choice: 9 }, deps))).toBe("invalid_choice");
    expect(await codeOf(() => submitAnswer({ attemptId: "missing", questionId: "p1", choice: 0 }, deps))).toBe("attempt_not_found");
  });
  it("refuses answers after the test is complete", async () => {
    const id = await takeTest(10);
    await completeAttempt(id, deps);
    expect(await codeOf(() => submitAnswer({ attemptId: id, questionId: "p1", choice: 0 }, deps))).toBe("attempt_completed");
  });
});

async function getReportAfterPaying(id: string) {
  await checkout({ attemptId: id, consent: true }, deps);
  return getReport(id, deps);
}

describe("scoring into the result", () => {
  it("turns 25 correct answers into the top estimate and an All-Rounder profile", async () => {
    const id = await takeTest(25);
    expect(await completeAttempt(id, deps)).toEqual({ completed: true });
    const { result } = await getReportAfterPaying(id);
    expect(result).toMatchObject({ raw: 25, estimate: 140, low: 134, high: 140, percentile: 99, profile: "all-rounder" });
  });
  it("scores a mixed attempt per skill and picks the profile from it", async () => {
    const id = await takeTest(13); // patterns 5, numbers 5, spatial 3, verbal 0, memory 0
    await completeAttempt(id, deps);
    const { result } = await getReportAfterPaying(id);
    expect(result.sections).toEqual({ patterns: 5, numbers: 5, spatial: 3, verbal: 0, memory: 0 });
    expect(result.estimate).toBe(102);
    expect(result.weakest).toEqual(["verbal", "memory"]);
    expect(result.profile).toBe("strategist");
  });
  it("counts unanswered questions as wrong", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    await completeAttempt(id, deps);
    expect((await getReportAfterPaying(id)).result).toMatchObject({ raw: 0, estimate: 70 });
  });
  it("gives the same result when completed twice", async () => {
    const id = await takeTest(18);
    expect(await completeAttempt(id, deps)).toEqual(await completeAttempt(id, at(1)));
  });
  it("reveals nothing about the score before payment", async () => {
    const id = await takeTest(16);
    expect(await completeAttempt(id, deps)).toEqual({ completed: true });
    expect(await getLockedResult(id, deps)).toEqual({ answered: 25 });
    const leaked = JSON.stringify([await completeAttempt(id, deps), await getLockedResult(id, deps), await viewAttempt(id, deps)]);
    for (const secret of ["estimate", "band", "percentile", "strongest", "sections", "profile"]) expect(leaked).not.toContain(secret);
  });
  it("refuses the locked result screen until the test is finished", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    expect(await codeOf(() => getLockedResult(id, deps))).toBe("attempt_incomplete");
  });
});

describe("paywall", () => {
  it("blocks the report until a trial is started", async () => {
    const id = await takeTest(15);
    await completeAttempt(id, deps);
    expect(await codeOf(() => getReport(id, deps))).toBe("subscription_required");
  });
  it("refuses checkout without the consent tick", async () => {
    const id = await takeTest(15);
    await completeAttempt(id, deps);
    expect(await codeOf(() => checkout({ attemptId: id, consent: false }, deps))).toBe("consent_required");
    expect(await codeOf(() => getReport(id, deps))).toBe("subscription_required");
  });
  it("refuses checkout before the test is finished", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    expect(await codeOf(() => checkout({ attemptId: id, consent: true }, deps))).toBe("attempt_incomplete");
  });
  it("refuses checkout when no payment processor is configured, instead of granting access", async () => {
    const id = await takeTest(15);
    await completeAttempt(id, deps);
    expect(await codeOf(() => checkout({ attemptId: id, consent: true }, { ...deps, paymentsMode: undefined }))).toBe("payments_unavailable");
    expect(await codeOf(() => getReport(id, deps))).toBe("subscription_required");
  });
  it("does not start a second subscription on a repeated checkout", async () => {
    const id = await takeTest(15);
    await completeAttempt(id, deps);
    const first = await checkout({ attemptId: id, consent: true }, deps);
    const second = await checkout({ attemptId: id, consent: true }, at(2));
    expect(second.renewsOn).toEqual(first.renewsOn);
  });
});

describe("plan over time", () => {
  let id: string;
  beforeEach(async () => {
    id = await takeTest(15);
    await completeAttempt(id, deps);
    await checkout({ attemptId: id, consent: true }, deps);
  });
  it("shows the renewal date and amount during the trial", async () => {
    expect(await getPlan(id, at(1))).toMatchObject({ status: "trialing", cancelled: false, nextCharge: { at: addDays(T0, 7), amountCents: 3999 } });
  });
  it("renews at day 7 when not cancelled and keeps the report open", async () => {
    expect((await getReport(id, at(8))).plan).toMatchObject({ status: "active", nextCharge: { at: addDays(T0, 35) } });
  });
  it("cancel in the trial: no further charge, access to day 7, then the report closes", async () => {
    expect(await cancelPlan(id, at(2))).toMatchObject({ cancelled: true, nextCharge: null, accessUntil: addDays(T0, 7) });
    expect((await getReport(id, at(6))).plan.cancelled).toBe(true);
    expect(await codeOf(() => getReport(id, at(7)))).toBe("subscription_ended");
  });
});
