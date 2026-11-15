import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

// Both projects run against the production build (`npm run build` first).
// Payments run in mock mode: no real card is ever charged by these tests.
export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
  },
  projects: [
    {
      name: "e2e",
      testDir: "./e2e",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "perf",
      testDir: "./perf",
      // One at a time so timings are not skewed by other tests.
      fullyParallel: false,
      workers: 1,
      retries: 0,
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: "npm run start",
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: { PAYMENTS_MODE: "mock" },
  },
});
