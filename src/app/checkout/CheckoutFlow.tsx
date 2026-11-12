"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import PageIntro from "@/components/PageIntro";
import { PLANS, usd, type PlanId } from "@/data/pricing";
import { isOn } from "@/lib/flags";
import { track } from "@/lib/track";

export default function CheckoutFlow({ planId }: { planId: PlanId }) {
  const plan = PLANS[planId];
  // Flag off = control arm: the classic checkout, straight to payment with no email step.
  const emailFirst = isOn("emailFirstCheckout");
  const [email, setEmail] = useState("");
  const [abandoned, setAbandoned] = useState(false);

  useEffect(() => {
    track("Checkout Started", { plan: planId, price: plan.price, variant: emailFirst ? "email_first" : "control" });
    // Restore the email after a refresh: sessionStorage only exists on the client, so this runs once on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { const saved = sessionStorage.getItem("checkout_email"); if (saved) setEmail(saved); } catch {}
  }, [planId, plan.price, emailFirst]);

  function onSent(e: string) {
    setEmail(e);
    try { sessionStorage.setItem("checkout_email", e); } catch {}
  }

  return (
    <div className="ps-section bg-canvas">
      <div className="ps-container">
        <PageIntro eyebrow={emailFirst ? "Email-first checkout" : "Checkout"} title="Checkout." accent={emailFirst ? "Email first, then payment." : "Pay in one step."} />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            {emailFirst && <div className={`p-6 md:p-7 ${email ? "ps-card" : "ps-panel"}`}>
              <p className="ps-mono-meta uppercase">Step 1 of 2</p>
              <p className="ps-title mt-1">Your email</p>
              {!email ? (
                <div className="mt-4">
                  <EmailCapture source="checkout" event="Checkout Email Captured" cta="Continue to payment"
                    data={{ plan: planId, price: plan.price, stage: "email_captured" }} onSent={onSent}
                    hint="We'll send your receipt and hold your spot if you leave." />
                </div>
              ) : (
                <p className="mt-2 text-[15px]">{email} <span className="text-success">· saved. If you leave now, we can still help you finish.</span></p>
              )}
            </div>}

            <div className={`ps-card p-6 md:p-7 ${emailFirst && !email ? "opacity-50" : ""}`}>
              {emailFirst && <p className="ps-mono-meta uppercase">Step 2 of 2</p>}
              <p className="ps-title mt-1">Payment</p>
              <div className="mt-4 space-y-3">
                <input disabled aria-label="Card number" placeholder="Card number" className="ps-input" />
                <div className="grid grid-cols-2 gap-3"><input disabled aria-label="Expiry" placeholder="MM / YY" className="ps-input" /><input disabled aria-label="CVC" placeholder="CVC" className="ps-input" /></div>
                <button disabled className="ps-btn ps-btn-primary ps-btn-lg w-full">Pay {usd(plan.price)}</button>
                <p className="text-xs text-secondary">Payments are disabled in this prototype. Installments would be shown here.</p>
              </div>
              {email && !abandoned && (
                <button onClick={() => { setAbandoned(true); track("Checkout Abandoned (simulated)", { plan: planId }); }} className="ps-link-arrow mt-5 text-sm">
                  Simulate abandoning checkout
                </button>
              )}
            </div>
          </div>

          <aside className="ps-card h-fit p-6 md:p-7">
            <p className="ps-mono-meta uppercase">Order summary</p>
            <p className="mt-2 flex items-center gap-2"><span className="ps-title">{plan.name}</span>{planId === "pro" && <span className="ps-badge ps-badge--popular">Most popular</span>}</p>
            <p className="mt-3 flex items-baseline gap-2"><span className="ps-stat text-[44px]">{usd(plan.price)}</span><span className="ps-mono-meta">{plan.period}</span></p>
            <ul className="mt-5 space-y-2.5 text-[15px] font-[350]">{plan.features.map((f) => <li key={f} className="flex gap-2.5"><span className="text-primary">✓</span>{f}</li>)}</ul>
            <p className="mt-6 pt-5 text-sm [box-shadow:var(--divider-top)]">Buying for 5+ people? <Link href="/teams" onClick={() => track("Team Link Clicked", { from: "checkout" })} className="ps-link-arrow">Get a team quote</Link></p>
          </aside>
        </div>

        {abandoned && (
          <EmailPreview to={email} subject={`Your ${plan.name} spot is still open`}>
            <p className="ps-mono-meta">Would be sent 1 hour after abandonment</p>
            <p>Hi, you were one step away from {plan.name} ({usd(plan.price)} {plan.period}).</p>
            <p>Your spot is saved. Finish in one click, or reply with any question: a learning advisor answers within the day.</p>
            <p><span className="ps-btn ps-btn-primary ps-btn-md">Complete my enrollment</span></p>
          </EmailPreview>
        )}

        <HypothesisNote
          hypothesis="Asking only for the email in step one turns abandoned checkouts into leads we can recover."
          metric="Share of started checkouts that leave an email."
          guardrail="Checkout completion rate does not fall by more than 2 points."
          ship="≥ 60% of started checkouts leave an email and recovery emails win back ≥ 10% of abandoners, with completion within −2pp." />
      </div>
    </div>
  );
}
