import { expect, test } from "@playwright/test";
import { startTrial, takeTest } from "./helpers";

test("a subscriber cancels in two taps and keeps access until the period ends", async ({ page }) => {
  const id = await takeTest(page, 2);
  await startTrial(page);

  await page.getByRole("link", { name: "Manage plan" }).click();
  await expect(page).toHaveURL(new RegExp(`/account/${id}$`));
  await expect(page.getByTestId("plan-status")).toContainText(/Next charge: \$39\.99 on/);

  await page.getByRole("button", { name: "Cancel plan" }).click(); // tap 1
  await page.getByRole("button", { name: "Confirm cancel" }).click(); // tap 2
  await expect(page.getByTestId("plan-status")).toContainText("Your plan is cancelled. You will not be charged again.");

  // Still cancelled after a reload, and the report stays open for the paid period.
  await page.reload();
  await expect(page.getByTestId("plan-status")).toContainText("Your plan is cancelled");
  await page.getByRole("link", { name: "Back to my report" }).click();
  await expect(page.getByTestId("plan-line")).toContainText(/Cancelled\. You keep access until/);
  await expect(page.getByTestId("estimate")).toBeVisible();
});

test("keep my plan backs out of cancelling", async ({ page }) => {
  await takeTest(page, 3);
  await startTrial(page);
  await page.getByRole("link", { name: "Manage plan" }).click();
  await page.getByRole("button", { name: "Cancel plan" }).click();
  await page.getByRole("button", { name: "Keep my plan" }).click();
  await expect(page.getByTestId("plan-status")).toContainText(/Next charge: \$39\.99 on/);
  await expect(page.getByRole("button", { name: "Cancel plan" })).toBeVisible();
});
