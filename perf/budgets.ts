// Performance bars. A run fails if any is exceeded. These are measured against
// the production build on the CI runner, so they catch regressions; they are
// not a substitute for real-user monitoring once the app is live.
export const BUDGETS = {
  /** Landing page Largest Contentful Paint (PRD: under 2.5 s). */
  landingLcpMs: 2500,
  /** JavaScript sent for the landing page, compressed. */
  landingJsBytes: 350_000,
  /** Tap on an answer until the next question is on screen. */
  answerToNextQuestionMs: 250,
  /** Scoring a finished test (API, 95th percentile). */
  scoreApiP95Ms: 300,
  /** Tap "Start 7-day trial" until the report is readable. */
  checkoutToReportMs: 2000,
  /** Checkout API alone (95th percentile). */
  checkoutApiP95Ms: 500,
} as const;
