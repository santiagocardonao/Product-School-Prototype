import { PLANS, TEAM_TIERS, type PlanId } from "@/data/pricing";

// The calculator prices 1–500 whole seats; anything else (0, negative, NaN, empty) becomes 1.
export const clampSeats = (seats: number) => Math.max(1, Math.min(500, Math.floor(seats || 1)));

export function teamQuote(seats: number, planId: PlanId) {
  const s = clampSeats(seats);
  const listPerSeat = PLANS[planId].price;
  const tier = TEAM_TIERS.find((t) => s >= t.min && s <= t.max)!;
  const perSeat = Math.round(listPerSeat * (1 - tier.discount));
  const total = perSeat * s;
  return {
    seats: s, planId, listPerSeat, discountPct: Math.round(tier.discount * 100), perSeat, total,
    savings: listPerSeat * s - total, isMql: s >= 5, offerSalesCall: s >= 25, talkToSales: s >= 50,
  };
}
export type TeamQuote = ReturnType<typeof teamQuote>;
