// Stand-in for Contentful. Public prices from productschool.com (Nov 2026).
export type PlanId = "single_certification" | "pro" | "unlimited";

export const PLANS: Record<PlanId, { id: PlanId; name: string; price: number; period: string; features: string[] }> = {
  single_certification: {
    id: "single_certification", name: "Live Certification", price: 2999, period: "one-off",
    features: ["1 live certification", "3 weeks, ~20 people per cohort", "12+ live hours with industry instructors"],
  },
  pro: {
    id: "pro", name: "Pro", price: 3999, period: "per year",
    features: ["1 live certification per year", "All recorded courses", "Weekly workshops", "$50k+ in AI tools"],
  },
  unlimited: {
    id: "unlimited", name: "Unlimited", price: 4999, period: "per year",
    features: ["12 certifications per year", "1:1 coaching", "ProductCon ticket", "Alumni community"],
  },
};

// PLACEHOLDER: team pricing is not public. Invented tiers, labelled in the UI.
export const TEAM_TIERS = [
  { min: 1, max: 4, discount: 0 },
  { min: 5, max: 9, discount: 0.1 },
  { min: 10, max: 24, discount: 0.15 },
  { min: 25, max: 49, discount: 0.2 },
  { min: 50, max: Infinity, discount: 0.25 },
];

export const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
