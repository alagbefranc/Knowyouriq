// The D1 store against a real SQL engine: Node's built-in SQLite stands in for
// Cloudflare D1 (D1 is SQLite), with the real migration applied.
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { beforeEach, describe, expect, it } from "vitest";
import { addDays, cancelSubscription, createSubscription } from "@/lib/billing";
import { QUESTIONS } from "@/lib/questions";
import { cancelPlan, checkout, completeAttempt, getReport, startAttempt, submitAnswer, viewAttempt, type Deps } from "@/lib/service";
import { D1Store, deserializeAttempt, serializeAttempt, type Attempt, type D1Like } from "@/lib/store";

function sqliteAsD1(db: DatabaseSync): D1Like {
  return {
    prepare(sql) {
      // D1 accepts numbered parameters (?1, ?2); node:sqlite binds them by position too.
      const statement = db.prepare(sql);
      return {
        bind: (...values) => ({
          first: async <T>() => (statement.get(...(values as never[])) as T | undefined) ?? null,
          run: async () => statement.run(...(values as never[])),
        }),
      };
    },
  };
}

const T0 = new Date("2026-11-15T10:00:00Z");
let sqlite: DatabaseSync;
let deps: Deps;

beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync("migrations/0001_attempts.sql", "utf8"));
  deps = { store: new D1Store(sqliteAsD1(sqlite)), now: T0, paymentsMode: "mock" };
});

describe("attempt serialization", () => {
  it("round-trips every date, including nested subscription dates", () => {
    const subscription = cancelSubscription(createSubscription(T0), addDays(T0, 2));
    const attempt: Attempt = { id: "a1", createdAt: T0, completedAt: addDays(T0, 0.01), answers: { p1: { choice: 1, ms: 900 } }, subscription };
    const back = deserializeAttempt(serializeAttempt(attempt));
    expect(back).toEqual(attempt);
    expect(back.subscription!.charges[0]!.at).toBeInstanceOf(Date);
    expect(back.subscription!.consent.at).toBeInstanceOf(Date);
    expect(back.subscription!.cancelledAt).toBeInstanceOf(Date);
  });
});

describe("D1 store", () => {
  it("returns undefined for an unknown attempt", async () => {
    expect(await deps.store!.getAttempt("missing")).toBeUndefined();
  });

  it("keeps the whole journey across separate store instances", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    for (const q of QUESTIONS) await submitAnswer({ attemptId: id, questionId: q.id, choice: q.answer, ms: 9000 }, deps);
    await completeAttempt(id, deps);
    await checkout({ attemptId: id, consent: true }, deps);

    // A new store on the same database, as after a server restart.
    const later: Deps = { ...deps, store: new D1Store(sqliteAsD1(sqlite)), now: addDays(T0, 8) };
    expect((await viewAttempt(id, later)).answeredIds).toHaveLength(25);
    const report = await getReport(id, later);
    expect(report.result.estimate).toBe(140);
    expect(report.plan).toMatchObject({ status: "active", nextCharge: { at: addDays(T0, 35), amountCents: 3999 } });
  });

  it("updates the same row instead of adding rows, and keeps lookup columns in step", async () => {
    const { id } = await startAttempt({ ageConfirmed: true }, deps);
    await submitAnswer({ attemptId: id, questionId: "p1", choice: 1 }, deps);
    await completeAttempt(id, deps);
    await checkout({ attemptId: id, consent: true }, deps);
    await cancelPlan(id, { ...deps, now: addDays(T0, 1) });
    const rows = sqlite.prepare("SELECT id, completed_at, subscription_status FROM attempts").all();
    expect(rows).toEqual([{ id, completed_at: T0.toISOString(), subscription_status: "trialing" }]);
    expect((await getReport(id, { ...deps, now: addDays(T0, 2) })).plan.cancelled).toBe(true);
  });
});
