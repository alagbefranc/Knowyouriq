# KnowYourIQ

A reasoning test you play, and a five-minute habit after it. Product requirements and the brand sheet live outside this file; brand assets and tokens are in `brand/`.

## Status

A working skeleton of the core journey: landing, 25-question test, free score band, paywall, paid report, cancel. It exists so every change runs through the test pipeline from day one.

Not real yet, and required before launch:

- **Questions**: `src/lib/questions.ts` is a 25-item sample bank, not the normed 150-item bank.
- **Scoring**: the norm in `src/lib/scoring.ts` is provisional until the norming panel is run.
- **Payments**: checkout only completes when `PAYMENTS_MODE=mock`. Without it the API answers 503 and grants nothing. Stripe is not wired up.
- **Storage**: on Cloudflare, attempts are saved in a D1 database. Locally (`npm run dev`) they live in memory.
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
| End to end | `npm run test:e2e` | A browser on a phone-sized screen clicks through the real app: take the test, pay, read the report, cancel. In CI it runs twice: against the Node build, and against the Cloudflare Workers build with a local D1 database |
| Performance | `npm run test:perf` | Bars in `perf/budgets.ts`: landing paint, answer latency, scoring, checkout to report |
| Ship | on `main` only | Applies database migrations and deploys to Cloudflare Workers, once the two secrets and the database id below are set |

`npm run ci` runs the first four locally. End-to-end and performance tests need `npm run build` first and run with mock payments; they never charge a card.

When adding a feature: unit tests for each new function, an integration test for the chain it joins, an end-to-end test if a person can click it, and a performance bar if a slow version would lose a customer.

## Cloudflare

The app deploys to Cloudflare Workers through OpenNext and stores data in D1.

The D1 database `knowyouriq` exists and its id is in `wrangler.jsonc`.

One-time setup still needed for automatic deploys: in the GitHub repository settings, add the secrets `CLOUDFLARE_API_TOKEN` (with Workers Scripts and D1 edit permission) and `CLOUDFLARE_ACCOUNT_ID`.

After that, every push to `main` that passes the pipeline migrates the database and deploys.

Run it locally on the Workers runtime:

```
npm run cf:build
npm run db:migrate:local
npm run cf:preview        # http://localhost:8787, mock payments
```

`PAYMENTS_MODE` is not set for the deployed Worker, so checkout there answers 503 until a real payment processor is wired in.
