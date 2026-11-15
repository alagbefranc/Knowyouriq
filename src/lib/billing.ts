// Billing rules. The wording produced here is the legally reviewed renewal
// disclosure (PRD M1-M3): do not change it in experiments.

export const PLAN = {
  currency: "USD",
  trialPriceCents: 399,
  trialDays: 7,
  renewalPriceCents: 3999,
  renewalEveryDays: 28,
  reminderDay: 5,
  refundWindowDays: 14,
} as const;

const DAY_MS = 86_400_000;
export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Calendar date in UTC, e.g. "22 November 2026". */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function termsLine(): string {
  return `${formatMoney(PLAN.trialPriceCents)} today for ${PLAN.trialDays} days. Then ${formatMoney(PLAN.renewalPriceCents)} every ${PLAN.renewalEveryDays / 7} weeks until you cancel.`;
}

export function consentLabel(): string {
  return `I agree to be charged ${formatMoney(PLAN.renewalPriceCents)} every ${PLAN.renewalEveryDays / 7} weeks after my ${PLAN.trialDays}-day trial unless I cancel.`;
}

export type CheckoutError = "consent_required";

/** The pay button only works once the renewal consent box is ticked. */
export function validateCheckout(input: { consent: unknown }): CheckoutError[] {
  return input.consent === true ? [] : ["consent_required"];
}

export interface Charge {
  kind: "trial" | "renewal";
  amountCents: number;
  at: Date;
  refundedAt?: Date;
}

export interface Subscription {
  status: "trialing" | "active" | "ended";
  startedAt: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  reminderSentAt?: Date;
  charges: Charge[];
  /** Exact disclosure text the customer agreed to, kept as proof of consent. */
  consent: { at: Date; terms: string; label: string };
}

export function createSubscription(now: Date): Subscription {
  return {
    status: "trialing",
    startedAt: now,
    currentPeriodEnd: addDays(now, PLAN.trialDays),
    cancelAtPeriodEnd: false,
    charges: [{ kind: "trial", amountCents: PLAN.trialPriceCents, at: now }],
    consent: { at: now, terms: termsLine(), label: consentLabel() },
  };
}

/** Cancelling stops future charges and keeps access until the paid period ends. */
export function cancelSubscription(sub: Subscription, now: Date): Subscription {
  if (sub.status === "ended" || sub.cancelAtPeriodEnd) return sub;
  return { ...sub, cancelAtPeriodEnd: true, cancelledAt: now };
}

/** Applies every renewal or expiry that has come due by `now`. */
export function advanceSubscription(sub: Subscription, now: Date): Subscription {
  let next = sub;
  while (next.status !== "ended" && now.getTime() >= next.currentPeriodEnd.getTime()) {
    if (next.cancelAtPeriodEnd) {
      next = { ...next, status: "ended" };
    } else {
      const at = next.currentPeriodEnd;
      next = {
        ...next,
        status: "active",
        currentPeriodEnd: addDays(at, PLAN.renewalEveryDays),
        charges: [...next.charges, { kind: "renewal", amountCents: PLAN.renewalPriceCents, at }],
      };
    }
  }
  return next;
}

export function hasAccess(sub: Subscription | undefined, now: Date): boolean {
  if (!sub) return false;
  return advanceSubscription(sub, now).status !== "ended";
}

/** The day-5 reminder is due once, and never for a plan already cancelled. */
export function reminderDue(sub: Subscription, now: Date): boolean {
  if (sub.status !== "trialing" || sub.cancelAtPeriodEnd || sub.reminderSentAt) return false;
  return now.getTime() >= addDays(sub.startedAt, PLAN.reminderDay).getTime();
}

/** A renewal charge is refunded on request within 14 days. Trial fees are not. */
export function refundEligible(charge: Charge, now: Date): boolean {
  if (charge.kind !== "renewal" || charge.refundedAt) return false;
  const age = now.getTime() - charge.at.getTime();
  return age >= 0 && age <= PLAN.refundWindowDays * DAY_MS;
}

export function nextCharge(sub: Subscription): { at: Date; amountCents: number } | null {
  if (sub.status === "ended" || sub.cancelAtPeriodEnd) return null;
  return { at: sub.currentPeriodEnd, amountCents: PLAN.renewalPriceCents };
}
