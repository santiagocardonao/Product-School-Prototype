import { describe, it, expect } from "vitest";
import { teamQuote } from "./teamQuote";

describe("teamQuote", () => {
  it("charges list price with no discount for 1–4 seats", () => {
    const q = teamQuote(4, "pro");
    expect(q.discountPct).toBe(0);
    expect(q.total).toBe(3999 * 4);
  });

  it("applies 10% at exactly 5 seats and marks it as an MQL", () => {
    const q = teamQuote(5, "pro");
    expect(q.discountPct).toBe(10);
    expect(q.isMql).toBe(true);
  });

  it("does not mark 4 seats as an MQL", () => {
    expect(teamQuote(4, "pro").isMql).toBe(false);
  });

  it("prices 12 Pro seats at 15% off, rounding the per-seat price to whole dollars", () => {
    const q = teamQuote(12, "pro");
    expect(q.perSeat).toBe(3399); // 3,999 × 0.85 = 3,399.15
    expect(q.total).toBe(40788);
    expect(q.savings).toBe(3999 * 12 - 40788);
  });

  it("applies 20% at 25 seats and 25% at 50 seats", () => {
    expect(teamQuote(25, "unlimited").discountPct).toBe(20);
    expect(teamQuote(50, "unlimited").discountPct).toBe(25);
  });

  it("sends 50+ seats to sales", () => {
    expect(teamQuote(49, "pro").talkToSales).toBe(false);
    expect(teamQuote(50, "pro").talkToSales).toBe(true);
  });

  it("clamps zero, negative and empty input to 1 seat", () => {
    expect(teamQuote(0, "pro").seats).toBe(1);
    expect(teamQuote(-3, "pro").seats).toBe(1);
    expect(teamQuote(Number(""), "pro").seats).toBe(1);
    expect(teamQuote(NaN, "pro").seats).toBe(1);
  });

  it("caps the calculator at 500 seats", () => {
    expect(teamQuote(9999, "pro").seats).toBe(500);
  });

  it("drops fractional seats", () => {
    expect(teamQuote(7.9, "single_certification").seats).toBe(7);
  });
});
