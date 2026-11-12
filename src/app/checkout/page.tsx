import { Suspense } from "react";
import CheckoutFlow from "./CheckoutFlow";
import type { PlanId } from "@/data/pricing";

const VALID: PlanId[] = ["single_certification", "pro", "unlimited"];

async function Checkout({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return <CheckoutFlow planId={VALID.includes(plan as PlanId) ? (plan as PlanId) : "pro"} />;
}

export default function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  return (
    <Suspense fallback={<div className="ps-section ps-container text-secondary">Loading checkout…</div>}>
      <Checkout searchParams={searchParams} />
    </Suspense>
  );
}
