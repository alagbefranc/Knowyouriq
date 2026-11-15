# KnowYourIQ

A reasoning test you play, and a five-minute habit after it. Product requirements and the brand sheet live outside this file; brand assets and tokens are in `brand/`.

## Status

A working skeleton of the core journey: landing, 25-question test, free score band, paywall, paid report, cancel. It exists so every change runs through the test pipeline from day one.

Not real yet, and required before launch:

- **Questions**: `src/lib/questions.ts` is a 25-item sample bank, not the normed 150-item bank.
- **Scoring**: the norm in `src/lib/scoring.ts` is provisional until the norming panel is run.
- **Payments**: checkout only completes when `PAYMENTS_MODE=mock`. Without it the API answers 503 and grants nothing. Stripe is not wired up.
- **Storage**: attempts live in server memory and are lost on restart.
- **Accounts, emails (receipt, day-5 reminder), daily training**: not built.

## Run it

```
npm install
PAYMENTS_MODE=mock npm run dev
```

## Pipeline

Every push runs, in order, and stops at the first failure:

| Stage | Command | What it proves |
| --- | --- | --- |
| Unit | `npm run test:unit` | One function, input to output: scoring, profiles, billing rules, streaks, XP, question bank |
| Integration | `npm run test:integration` | Units chained: answers to score to teaser to checkout to report to cancel, through the service and the API routes |
| End to end | `npm run test:e2e` | A browser on a phone-sized screen clicks through the real app: take the test, pay, read the report, cancel |
| Performance | `npm run test:perf` | Bars in `perf/budgets.ts`: landing paint, answer latency, scoring, checkout to report |
| Ship | on `main` only | Deploys to Vercel once `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are set as repository secrets |

`npm run ci` runs the first four locally. End-to-end and performance tests need `npm run build` first and run with mock payments; they never charge a card.

When adding a feature: unit tests for each new function, an integration test for the chain it joins, an end-to-end test if a person can click it, and a performance bar if a slow version would lose a customer.
