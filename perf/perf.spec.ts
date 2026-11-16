import { expect, test, type APIRequestContext } from "@playwright/test";
import { takeTest } from "../e2e/helpers";
import { BUDGETS } from "./budgets";

const p95 = (values: number[]) => [...values].sort((a, b) => a - b)[Math.ceil(values.length * 0.95) - 1] as number;

async function finishedAttempt(request: APIRequestContext): Promise<string> {
  const { id } = await (await request.post("/api/attempts", { data: { ageConfirmed: true } })).json();
  for (const questionId of ["p1", "n1", "s1", "v1", "m1"]) {
    await request.post(`/api/attempts/${id}/answers`, { data: { questionId, choice: 1 } });
  }
  return id;
}

test("landing page paints fast and ships little JavaScript", async ({ page }) => {
  let jsBytes = 0;
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return;
    const sizes = await response.request().sizes().catch(() => null);
    jsBytes += sizes?.responseBodySize ?? 0;
  });
  await page.goto("/", { waitUntil: "load" });
  const lcp = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries[entries.length - 1]!.startTime);
        }).observe({ type: "largest-contentful-paint", buffered: true });
      }),
  );
  console.log(`landing LCP ${Math.round(lcp)} ms (bar ${BUDGETS.landingLcpMs}), JS ${jsBytes} bytes (bar ${BUDGETS.landingJsBytes})`);
  expect(lcp).toBeLessThan(BUDGETS.landingLcpMs);
  expect(jsBytes).toBeGreaterThan(0);
  expect(jsBytes).toBeLessThan(BUDGETS.landingJsBytes);
});

test("answering a question feels instant", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "25 to 34" }).click();
  const timings: number[] = [];
  for (let n = 1; n <= 4; n += 1) {
    await expect(page.getByTestId("position")).toHaveText(`${n} of 25`);
    await expect(page.getByTestId("option").first()).toBeVisible();
    // Timed inside the page, from the tap to the counter changing, so the
    // number is the app's own latency and not the test driver's.
    const elapsed = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const position = document.querySelector('[data-testid="position"]') as HTMLElement;
          const before = position.textContent;
          const started = performance.now();
          const observer = new MutationObserver(() => {
            if (position.textContent === before) return;
            observer.disconnect();
            resolve(performance.now() - started);
          });
          observer.observe(position, { childList: true, characterData: true, subtree: true });
          (document.querySelector('[data-testid="option"]') as HTMLElement).click();
        }),
    );
    timings.push(Math.round(elapsed));
  }
  console.log(`answer -> next question: ${timings.join(", ")} ms (bar ${BUDGETS.answerToNextQuestionMs})`);
  expect(Math.max(...timings)).toBeLessThan(BUDGETS.answerToNextQuestionMs);
});

test("scoring a finished test is fast", async ({ request }) => {
  const timings: number[] = [];
  for (let i = 0; i < 20; i += 1) {
    const id = await finishedAttempt(request);
    const started = performance.now();
    const response = await request.post(`/api/attempts/${id}/complete`);
    timings.push(performance.now() - started);
    expect(response.ok()).toBe(true);
  }
  console.log(`score API p95 ${Math.round(p95(timings))} ms (bar ${BUDGETS.scoreApiP95Ms})`);
  expect(p95(timings)).toBeLessThan(BUDGETS.scoreApiP95Ms);
});

test("checkout API is fast", async ({ request }) => {
  const timings: number[] = [];
  for (let i = 0; i < 20; i += 1) {
    const id = await finishedAttempt(request);
    await request.post(`/api/attempts/${id}/complete`);
    const started = performance.now();
    const response = await request.post("/api/checkout", { data: { attemptId: id, consent: true } });
    timings.push(performance.now() - started);
    expect(response.status()).toBe(201);
  }
  console.log(`checkout API p95 ${Math.round(p95(timings))} ms (bar ${BUDGETS.checkoutApiP95Ms})`);
  expect(p95(timings)).toBeLessThan(BUDGETS.checkoutApiP95Ms);
});

test("paying to reading the report takes under two seconds", async ({ page }) => {
  await takeTest(page);
  await page.getByLabel(/I agree to be charged \$39\.99/).check();
  const started = Date.now();
  await page.getByRole("button", { name: "Start 7-day trial" }).click();
  await expect(page.getByTestId("estimate")).toBeVisible();
  const elapsed = Date.now() - started;
  console.log(`checkout -> report ${elapsed} ms (bar ${BUDGETS.checkoutToReportMs})`);
  expect(elapsed).toBeLessThan(BUDGETS.checkoutToReportMs);
});
