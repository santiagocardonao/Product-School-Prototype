import { notFound } from "next/navigation";
import CheckoutFlow from "../CheckoutFlow";
import type { PlanId } from "@/data/pricing";

const PLANS: PlanId[] = ["single_certification", "pro", "unlimited"];

// Prerendered per plan so checkout loads instantly instead of waiting on a server render.
export function generateStaticParams() {
  return PLANS.map((plan) => ({ plan }));
}

export default async function CheckoutPlanPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = await params;
  if (!PLANS.includes(plan as PlanId)) notFound();
  return <CheckoutFlow planId={plan as PlanId} />;
}
