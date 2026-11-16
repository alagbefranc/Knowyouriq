import { expect, type Page } from "@playwright/test";

/** Clicks through the whole test the way a person would, always picking the option at `pick`. */
export async function takeTest(page: Page, pick = 0) {
  await page.goto("/");
  await page.getByRole("button", { name: "25 to 34" }).click();
  await expect(page).toHaveURL(/\/test\//);

  for (let n = 1; n <= 25; n += 1) {
    await expect(page.getByTestId("position")).toHaveText(`${n} of 25`);
    // Memory questions show a set to remember for up to 20 seconds; say we are ready to move on.
    await page.locator('[data-testid="option"], [data-testid="ready"]').first().waitFor();
    if (await page.getByTestId("ready").isVisible()) await page.getByTestId("ready").click();
    await page.getByTestId("option").nth(pick).click();
    if (n % 5 === 0) {
      await expect(page.getByRole("heading", { name: /Section complete/ })).toBeVisible();
      await page.getByRole("button", { name: n === 25 ? "See my result" : "Continue" }).click();
    }
  }
  await expect(page).toHaveURL(/\/result\//);
  return page.url().split("/").pop() as string;
}

export async function startTrial(page: Page) {
  await page.getByLabel(/I agree to be charged \$39\.99/).check();
  await page.getByRole("button", { name: "Start 7-day trial" }).click();
  await expect(page).toHaveURL(/\/report\//);
}
