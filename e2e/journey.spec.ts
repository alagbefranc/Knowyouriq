import { expect, test } from "@playwright/test";
import { startTrial, takeTest } from "./helpers";

test("landing states the price and renewal before the test starts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("pricing-notice")).toContainText("$3.99 today for 7 days. Then $39.99 every 4 weeks until you cancel.");
  // The test cannot start until the visitor confirms their age.
  await page.getByRole("button", { name: "Start the free test" }).click();
  await expect(page.getByText("Tick the box to confirm you are 18 or older.")).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("visitor takes the test, hits the paywall with no score shown, pays, and reads the report", async ({ page }) => {
  const scoring: string[] = [];
  page.on("response", async (response) => {
    if (response.url().endsWith("/complete")) scoring.push(await response.text().catch(() => ""));
  });
  await takeTest(page);

  // Hard paywall: the result screen and the scoring response reveal nothing about the score.
  await expect(page.getByRole("heading", { name: "Your score is ready" })).toBeVisible();
  await expect(page.getByTestId("locked")).toBeVisible();
  await expect(page.getByTestId("estimate")).toHaveCount(0);
  await expect(page.getByTestId("band")).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(/\b(7\d|8\d|9\d|1[0-4]\d) to \d{2,3}\b/);
  await expect(page.locator("main")).not.toContainText(/Strongest skill|Higher than \d/);
  expect(scoring).toEqual([JSON.stringify({ completed: true })]);

  // Paywall: terms sit with the button, and the button is locked until consent is given.
  await expect(page.getByTestId("terms")).toContainText("$3.99 today for 7 days. Then $39.99 every 4 weeks until you cancel.");
  await expect(page.getByTestId("terms")).toContainText(/renews on \d{1,2} \w+ \d{4}/);
  await expect(page.getByLabel(/I agree to be charged/)).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Start 7-day trial" })).toBeDisabled();

  await startTrial(page);

  const estimate = Number(await page.getByTestId("estimate").textContent());
  expect(estimate).toBeGreaterThanOrEqual(70);
  expect(estimate).toBeLessThanOrEqual(140);
  await expect(page.getByText(/Likely range \d+ to \d+/)).toBeVisible();
  await expect(page.getByTestId("profile")).not.toBeEmpty();
  await expect(page.getByTestId("plan-line")).toContainText(/Renews on .* for \$39\.99/);
});

test("the report cannot be opened without paying", async ({ page }) => {
  const id = await takeTest(page, 1);
  await page.goto(`/report/${id}`);
  await expect(page).toHaveURL(new RegExp(`/result/${id}$`));
  await expect(page.getByRole("button", { name: "Start 7-day trial" })).toBeVisible();
});

test("a refresh mid-test resumes at the same question", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("I am 18 or older.").check();
  await page.getByRole("button", { name: "Start the free test" }).click();
  for (let n = 1; n <= 3; n += 1) {
    await expect(page.getByTestId("position")).toHaveText(`${n} of 25`);
    await page.getByTestId("option").first().click();
  }
  await expect(page.getByTestId("position")).toHaveText("4 of 25");
  await page.reload();
  await expect(page.getByTestId("position")).toHaveText("4 of 25");
});

test("the browser never receives answer keys", async ({ page }) => {
  const bodies: string[] = [];
  page.on("response", async (response) => {
    if (response.url().includes("/test/") || response.url().includes("/api/")) {
      bodies.push(await response.text().catch(() => ""));
    }
  });
  await page.goto("/");
  await page.getByLabel("I am 18 or older.").check();
  await page.getByRole("button", { name: "Start the free test" }).click();
  await expect(page.getByTestId("position")).toHaveText("1 of 25");
  await page.getByTestId("option").first().click();
  await expect(page.getByTestId("position")).toHaveText("2 of 25");
  expect(bodies.length).toBeGreaterThan(0);
  for (const body of bodies) expect(body).not.toMatch(/"answer"\s*:/);
});

test("an unknown test link shows a way back, not an error", async ({ page }) => {
  const response = await page.goto("/test/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "Start the free test" })).toBeVisible();
});
