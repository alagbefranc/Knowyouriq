import { expect, test } from "@playwright/test";
import { startTrial, takeTest } from "./helpers";

test("a subscriber opens the courses, completes a lesson, and the progress sticks", async ({ page }) => {
  const id = await takeTest(page, 1);
  await startTrial(page);
  await page.getByRole("link", { name: "Open my courses" }).click();
  await expect(page).toHaveURL(new RegExp(`/learn/${id}$`));
  await expect(page.getByTestId("course")).toHaveCount(4);
  await expect(page.getByText("0 of 16 lessons done")).toBeVisible();
  await expect(page.getByText("not affiliated with Mercor")).toBeVisible();

  await page.getByRole("link", { name: "Start course" }).first().click();
  await expect(page.getByRole("heading", { name: "What an AI trainer actually does" })).toBeVisible();
  const finish = page.getByRole("button", { name: "Complete and continue" });
  await expect(finish).toBeDisabled();

  // Practice checks show the reason straight away, right or wrong.
  for (const check of await page.getByTestId("check").all()) await check.getByTestId("check-option").first().click();
  await expect(page.getByTestId("check-why")).toHaveCount(2);
  await finish.click();
  await expect(page.getByRole("heading", { name: "How people get in" })).toBeVisible();

  await page.goto(`/learn/${id}`);
  await expect(page.getByText("1 of 16 lessons done")).toBeVisible();
});

test("courses cannot be opened without paying", async ({ page }) => {
  const id = await takeTest(page, 2);
  await page.goto(`/learn/${id}`);
  await expect(page).toHaveURL(new RegExp(`/result/${id}$`));
  await page.goto(`/learn/${id}/rubrics-1`);
  await expect(page).toHaveURL(new RegExp(`/result/${id}$`));
  const response = await page.request.post(`/api/learn/${id}/lessons`, { data: { lessonId: "rubrics-1" } });
  expect(response.status()).toBe(402);
});
