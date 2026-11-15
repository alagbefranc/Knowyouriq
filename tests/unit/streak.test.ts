import { describe, expect, it } from "vitest";
import { MAX_FREEZES, NEW_STREAK, recordSession, type Streak } from "@/lib/streak";

const run = (days: string[], from: Streak = NEW_STREAK) => days.reduce(recordSession, from);

describe("recordSession", () => {
  it("starts a streak at 1", () => {
    expect(recordSession(NEW_STREAK, "2026-11-15")).toEqual({ current: 1, longest: 1, lastDay: "2026-11-15", freezes: 0 });
  });
  it("grows on consecutive days, across a month boundary", () => {
    expect(run(["2026-11-29", "2026-11-30", "2026-12-01"]).current).toBe(3);
  });
  it("ignores a second session on the same day", () => {
    const once = recordSession(NEW_STREAK, "2026-11-15");
    expect(recordSession(once, "2026-11-15")).toBe(once);
  });
  it("resets after a missed day with no freeze, keeping the longest", () => {
    const s = run(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-05"]);
    expect(s.current).toBe(1);
    expect(s.longest).toBe(3);
  });
  it("earns a freeze on day 7 and spends it on one missed day", () => {
    const week = run(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07"]);
    expect(week.freezes).toBe(1);
    const saved = recordSession(week, "2026-11-09");
    expect(saved.current).toBe(8);
    expect(saved.freezes).toBe(0);
  });
  it("does not cover two missed days with a freeze", () => {
    expect(recordSession({ current: 9, longest: 9, lastDay: "2026-11-09", freezes: 1 }, "2026-11-12").current).toBe(1);
  });
  it("caps freezes", () => {
    expect(recordSession({ current: 13, longest: 13, lastDay: "2026-11-13", freezes: MAX_FREEZES }, "2026-11-14").freezes).toBe(MAX_FREEZES);
  });
  it("rejects a day before the last session or an invalid day", () => {
    const s = recordSession(NEW_STREAK, "2026-11-15");
    expect(() => recordSession(s, "2026-11-14")).toThrow(RangeError);
    expect(() => recordSession(NEW_STREAK, "yesterday")).toThrow(RangeError);
  });
});
