"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import { PLANS, usd, type PlanId } from "@/data/pricing";
import { track } from "@/lib/track";

export default function CheckoutFlow({ planId }: { planId: PlanId }) {
  const plan = PLANS[planId];
  const [email, setEmail] = useState("");
  const [abandoned, setAbandoned] = useState(false);

  useEffect(() => {
    track("Checkout Started", { plan: planId, price: plan.price });
    try { const saved = sessionStorage.getItem("checkout_email"); if (saved) setEmail(saved); } catch {}
  }, [planId, plan.price]);

  function onSent(e: string) {
    setEmail(e);
    try { sessionStorage.setItem("checkout_email", e); } catch {}
  }

  return (
    <div className="pt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Email-first checkout</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div className={`rounded-card border bg-surface p-6 ${email ? "border-line" : "border-primary"}`}>
            <p className="text-xs font-semibold text-muted">STEP 1 OF 2</p>
            <p className="mt-1 text-lg font-semibold">Your email</p>
            {!email ? (
              <div className="mt-3">
                <EmailCapture source="checkout" event="Checkout Email Captured" cta="Continue to payment"
                  data={{ plan: planId, price: plan.price, stage: "email_captured" }} onSent={onSent} />
              </div>
            ) : (
              <p className="mt-2 text-sm">{email} <span className="text-success">· saved. If you leave now, we can still help you finish.</span></p>
            )}
          </div>

          <div className={`rounded-card border border-line bg-surface p-6 ${email ? "" : "opacity-50"}`}>
            <p className="text-xs font-semibold text-muted">STEP 2 OF 2</p>
            <p className="mt-1 text-lg font-semibold">Payment</p>
            <div className="mt-3 space-y-3">
              <input disabled placeholder="Card number" className="w-full rounded-field border border-line bg-canvas px-3 py-2.5" />
              <div className="grid grid-cols-2 gap-3"><input disabled placeholder="MM / YY" className="rounded-field border border-line bg-canvas px-3 py-2.5" /><input disabled placeholder="CVC" className="rounded-field border border-line bg-canvas px-3 py-2.5" /></div>
              <button disabled className="w-full rounded-field bg-primary px-5 py-3 font-semibold text-on-primary opacity-50">Pay {usd(plan.price)}</button>
              <p className="text-xs text-muted">Payments are disabled in this prototype. Installments would be shown here.</p>
            </div>
            {email && !abandoned && (
              <button onClick={() => { setAbandoned(true); track("Checkout Abandoned (simulated)", { plan: planId }); }} className="mt-4 text-sm font-semibold text-primary underline">
                Simulate abandoning checkout →
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-card border border-line bg-surface p-6">
          <p className="text-sm text-muted">Order summary</p>
          <p className="mt-1 text-xl font-semibold">{plan.name}</p>
          <p className="mt-1 font-display text-3xl font-bold">{usd(plan.price)} <span className="text-sm font-normal text-muted">{plan.period}</span></p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted">{plan.features.map((f) => <li key={f}>· {f}</li>)}</ul>
          <p className="mt-5 border-t border-line pt-4 text-sm">Buying for 5+ people? <Link href="/teams" onClick={() => track("Team Link Clicked", { from: "checkout" })} className="font-semibold text-primary">Get a team quote</Link></p>
        </aside>
      </div>

      {abandoned && (
        <EmailPreview to={email} subject={`Your ${plan.name} spot is still open`}>
          <p className="text-xs text-muted">Would be sent 1 hour after abandonment.</p>
          <p>Hi, you were one step away from {plan.name} ({usd(plan.price)} {plan.period}).</p>
          <p>Your spot is saved. Finish in one click, or reply with any question: a learning advisor answers within the day.</p>
          <p className="font-semibold text-primary">Complete my enrollment →</p>
        </EmailPreview>
      )}

      <HypothesisNote
        hypothesis="Asking only for the email in step one turns abandoned checkouts into leads we can recover."
        metric="Share of started checkouts that leave an email."
        guardrail="Checkout completion rate does not fall by more than 2 points." />
    </div>
  );
}
