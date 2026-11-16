import { describe, expect, it } from "vitest";
import { certificateId, certificateName } from "@/lib/certificate";

describe("certificateId", () => {
  it("is two groups of four digits", () => {
    expect(certificateId("94433d5e-983e-4b40-bb43-cee7495ef40f")).toMatch(/^\d{4} \d{4}$/);
  });
  it("is stable for the same attempt and different for another", () => {
    expect(certificateId("a")).toBe(certificateId("a"));
    expect(certificateId("a")).not.toBe(certificateId("b"));
  });
});

describe("certificateName", () => {
  it("trims and collapses spaces", () => {
    expect(certificateName("  Jordan   Lee ")).toBe("Jordan Lee");
  });
  it("removes markup characters and control characters", () => {
    expect(certificateName("<b>Jo</b>\u0007")).toBe("bJo/b");
  });
  it("caps the length at 60 and rejects non-strings", () => {
    expect(certificateName("x".repeat(200))).toHaveLength(60);
    expect(certificateName(undefined)).toBe("");
    expect(certificateName(["a"])).toBe("");
  });
});
