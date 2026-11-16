// The HTTP layer over the same chain: route handlers called with real Request objects.
import { beforeEach, describe, expect, it } from "vitest";
import { POST as answer } from "@/app/api/attempts/[id]/answers/route";
import { POST as complete } from "@/app/api/attempts/[id]/complete/route";
import { POST as start } from "@/app/api/attempts/route";
import { POST as pay } from "@/app/api/checkout/route";
import { POST as cancel } from "@/app/api/plan/[id]/cancel/route";
import { QUESTIONS } from "@/lib/questions";
import { getReport } from "@/lib/service";

const post = (body?: unknown) =>
  new Request("http://test.local/api", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });
const ctx = (id: string) => ({ params: Promise.resolve({ id }) });

async function finishedAttempt(): Promise<string> {
  const { id } = await (await start(post({ ageConfirmed: true }))).json();
  for (const q of QUESTIONS) await answer(post({ questionId: q.id, choice: q.answer, ms: 9000 }), ctx(id));
  await complete(post(), ctx(id));
  return id;
}

beforeEach(() => {
  process.env.PAYMENTS_MODE = "mock";
});

describe("API", () => {
  it("POST /api/attempts needs the age confirmation", async () => {
    const refused = await start(post({}));
    expect(refused.status).toBe(400);
    expect((await refused.json()).error).toBe("age_required");
    const ok = await start(post({ ageConfirmed: true }));
    expect(ok.status).toBe(201);
    expect((await ok.json()).id).toMatch(/^[0-9a-f-]{36}$/);
  });
  it("answers return progress and never the correct answer", async () => {
    const { id } = await (await start(post({ ageConfirmed: true }))).json();
    const response = await answer(post({ questionId: "p1", choice: 0 }), ctx(id));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ answered: 1 });
  });
  it("returns 404 for an unknown attempt and 400 for a bad choice", async () => {
    expect((await answer(post({ questionId: "p1", choice: 0 }), ctx("nope"))).status).toBe(404);
    const { id } = await (await start(post({ ageConfirmed: true }))).json();
    expect((await answer(post({ questionId: "p1", choice: "A" }), ctx(id))).status).toBe(400);
    expect((await complete(post(), ctx("nope"))).status).toBe(404);
  });
  it("complete returns nothing about the score", async () => {
    const { id } = await (await start(post({ ageConfirmed: true }))).json();
    for (const q of QUESTIONS) await answer(post({ questionId: q.id, choice: q.answer }), ctx(id));
    expect(await (await complete(post(), ctx(id))).json()).toEqual({ completed: true });
  });
  it("checkout is refused without consent and succeeds with it", async () => {
    const id = await finishedAttempt();
    const refused = await pay(post({ attemptId: id }));
    expect(refused.status).toBe(400);
    expect((await refused.json()).error).toBe("consent_required");
    const ok = await pay(post({ attemptId: id, consent: true }));
    expect(ok.status).toBe(201);
    expect(Date.parse((await ok.json()).renewsOn)).toBeGreaterThan(Date.now());
    expect((await getReport(id)).result.estimate).toBe(140);
  });
  it("checkout returns 503 when payments are not configured", async () => {
    const id = await finishedAttempt();
    delete process.env.PAYMENTS_MODE;
    expect((await pay(post({ attemptId: id, consent: true }))).status).toBe(503);
  });
  it("cancel stops the renewal and reports the access end date", async () => {
    const id = await finishedAttempt();
    expect((await cancel(post(), ctx(id))).status).toBe(402);
    await pay(post({ attemptId: id, consent: true }));
    const response = await cancel(post(), ctx(id));
    expect(response.status).toBe(200);
    expect((await response.json()).cancelled).toBe(true);
    expect((await getReport(id)).plan.nextCharge).toBeNull();
  });
});
