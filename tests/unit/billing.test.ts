import { describe, expect, it } from "vitest";
import {
  addDays, advanceSubscription, cancelSubscription, consentLabel, createSubscription, formatDate, formatMoney,
  hasAccess, nextCharge, PLAN, refundEligible, reminderDue, termsLine, validateCheckout,
} from "@/lib/billing";

const START = new Date("2026-11-15T10:00:00Z");
const day = (n: number) => addDays(START, n);

describe("disclosure wording", () => {
  it("states the trial price, the renewal price and the period in one line", () => {
    expect(termsLine()).toBe("$3.99 today for 7 days. Then $39.99 every 4 weeks until you cancel.");
  });
  it("puts the renewal amount in the consent label", () => {
    expect(consentLabel()).toBe("I agree to be charged $39.99 every 4 weeks after my 7-day trial unless I cancel.");
  });
  it("formats money and dates", () => {
    expect(formatMoney(399)).toBe("$3.99");
    expect(formatMoney(3999)).toBe("$39.99");
    expect(formatDate(day(7))).toBe("22 November 2026");
  });
});

describe("validateCheckout", () => {
  it("accepts only an explicit true consent", () => {
    expect(validateCheckout({ consent: true })).toEqual([]);
  });
  it.each([false, undefined, null, "true", 1])("rejects consent=%o", (consent) => {
    expect(validateCheckout({ consent })).toEqual(["consent_required"]);
  });
});

describe("subscription lifecycle", () => {
  it("starts as a 7-day trial with one $3.99 charge and a stored consent record", () => {
    const sub = createSubscription(START);
    expect(sub.status).toBe("trialing");
    expect(sub.currentPeriodEnd).toEqual(day(7));
    expect(sub.charges).toEqual([{ kind: "trial", amountCents: 399, at: START }]);
    expect(sub.consent).toEqual({ at: START, terms: termsLine(), label: consentLabel() });
  });
  it("does not charge before the trial ends", () => {
    const sub = advanceSubscription(createSubscription(START), day(6.99));
    expect(sub.status).toBe("trialing");
    expect(sub.charges).toHaveLength(1);
  });
  it("charges $39.99 at day 7 and then every 28 days", () => {
    const first = advanceSubscription(createSubscription(START), day(7));
    expect(first.status).toBe("active");
    expect(first.charges.at(-1)).toEqual({ kind: "renewal", amountCents: 3999, at: day(7) });
    expect(first.currentPeriodEnd).toEqual(day(35));
    const later = advanceSubscription(createSubscription(START), day(63));
    expect(later.charges.filter((c) => c.kind === "renewal").map((c) => c.at)).toEqual([day(7), day(35), day(63)]);
  });
  it("never charges a cancelled trial and ends access at day 7", () => {
    const cancelled = cancelSubscription(createSubscription(START), day(3));
    expect(hasAccess(cancelled, day(6))).toBe(true);
    const ended = advanceSubscription(cancelled, day(8));
    expect(ended.status).toBe("ended");
    expect(ended.charges).toHaveLength(1);
    expect(hasAccess(cancelled, day(8))).toBe(false);
  });
  it("keeps access to the end of a paid period after cancelling", () => {
    const active = advanceSubscription(createSubscription(START), day(10));
    const cancelled = cancelSubscription(active, day(10));
    expect(hasAccess(cancelled, day(34))).toBe(true);
    expect(hasAccess(cancelled, day(35))).toBe(false);
    expect(advanceSubscription(cancelled, day(100)).charges).toHaveLength(2);
  });
  it("treats a second cancel as a no-op", () => {
    const once = cancelSubscription(createSubscription(START), day(1));
    expect(cancelSubscription(once, day(2))).toBe(once);
  });
  it("gives no access without a subscription", () => {
    expect(hasAccess(undefined, START)).toBe(false);
  });
  it("reports the next charge, or none once cancelled", () => {
    const sub = createSubscription(START);
    expect(nextCharge(sub)).toEqual({ at: day(7), amountCents: PLAN.renewalPriceCents });
    expect(nextCharge(cancelSubscription(sub, day(1)))).toBeNull();
  });
});

describe("day-5 reminder", () => {
  const sub = createSubscription(START);
  it("is not due before day 5 and is due from day 5", () => {
    expect(reminderDue(sub, day(4.9))).toBe(false);
    expect(reminderDue(sub, day(5))).toBe(true);
  });
  it("is sent once, and never to a cancelled plan", () => {
    expect(reminderDue({ ...sub, reminderSentAt: day(5) }, day(6))).toBe(false);
    expect(reminderDue(cancelSubscription(sub, day(2)), day(5))).toBe(false);
  });
});

describe("refunds", () => {
  const renewal = { kind: "renewal" as const, amountCents: 3999, at: day(7) };
  it("refunds a renewal within 14 days", () => {
    expect(refundEligible(renewal, day(7))).toBe(true);
    expect(refundEligible(renewal, day(21))).toBe(true);
  });
  it("does not refund after 14 days, twice, or the trial fee", () => {
    expect(refundEligible(renewal, day(21.01))).toBe(false);
    expect(refundEligible({ ...renewal, refundedAt: day(8) }, day(9))).toBe(false);
    expect(refundEligible({ kind: "trial", amountCents: 399, at: START }, day(1))).toBe(false);
  });
});
