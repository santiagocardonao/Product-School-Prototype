"use client";
import { useEffect, useRef, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import { CATALOG, courseBySlug } from "@/data/catalog";
import { PLANS, TEAM_TIERS, usd, type PlanId } from "@/data/pricing";
import { teamQuote } from "@/lib/teamQuote";
import { track } from "@/lib/track";

export default function TeamsPage() {
  const [seats, setSeats] = useState(12);
  const [planId, setPlanId] = useState<PlanId>("pro");
  const [focus, setFocus] = useState("");
  const [sentTo, setSentTo] = useState("");
  const q = teamQuote(seats, planId);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { track("Team Calculator Viewed"); }, []);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => track("Team Quote Calculated", { seats: q.seats, plan: planId, total: q.total }), 800);
  }, [q.seats, planId, q.total]);

  const field = "w-full rounded-field border border-line bg-surface px-3 py-2.5 outline-none focus:border-primary";

  return (
    <div className="pt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Team pricing calculator · enterprise</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight">Upskill your product team. See the price now.</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5 rounded-card border border-line bg-surface p-6">
          <label className="block text-sm font-semibold">How many people?
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={1} max={100} value={Math.min(seats, 100)} onChange={(e) => setSeats(+e.target.value)} className="flex-1 accent-[var(--ps-color-primary)]" />
              <input type="number" min={1} max={500} value={seats} onChange={(e) => setSeats(+e.target.value)} className="w-24 rounded-field border border-line px-3 py-2" />
            </div>
          </label>
          <label className="block text-sm font-semibold">Plan
            <select value={planId} onChange={(e) => setPlanId(e.target.value as PlanId)} className={`${field} mt-2`}>
              {Object.values(PLANS).map((p) => <option key={p.id} value={p.id}>{p.name} · {usd(p.price)} {p.period}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold">Focus course <span className="font-normal text-muted">(optional)</span>
            <select value={focus} onChange={(e) => setFocus(e.target.value)} className={`${field} mt-2`}>
              <option value="">No preference</option>
              {CATALOG.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
          </label>
          <div className="rounded-field bg-warning-soft px-3 py-2 text-xs">
            <span className="font-semibold">Placeholder discounts.</span> Team pricing is not public; these tiers are invented for the prototype: {TEAM_TIERS.map((t) => `${t.min}${t.max === Infinity ? "+" : `–${t.max}`}: ${t.discount * 100}%`).join(" · ")}
          </div>
        </div>

        <div className="rounded-card border border-line bg-surface p-6">
          <p className="text-sm text-muted">{q.seats} {q.seats === 1 ? "person" : "people"} · {PLANS[planId].name}</p>
          <p className="mt-1 font-display text-5xl font-bold">{usd(q.total)}</p>
          <p className="mt-1 text-sm text-muted">{usd(q.perSeat)} per person {PLANS[planId].period}{q.discountPct ? ` · ${q.discountPct}% team discount · you save ${usd(q.savings)}` : ""}</p>
          {q.talkToSales && <p className="mt-3 text-sm font-semibold text-primary">50+ people: a learning advisor can build a custom program.</p>}

          <div className="mt-6 border-t border-line pt-5">
            {!sentTo ? (
              <>
                <p className="mb-3 font-semibold">Email me the full proposal</p>
                <EmailCapture source="team_calculator" event="Team Quote Requested" cta="Send me the proposal" withCompany
                  data={{ seats: q.seats, plan: planId, focusCourse: focus || null, total: q.total, perSeat: q.perSeat, discountPct: q.discountPct, mql: q.isMql, mqlReason: q.isMql ? "team_5plus" : null }}
                  onSent={setSentTo} />
              </>
            ) : (
              <p className="font-semibold text-success">Proposal sent to {sentTo}. {q.isMql ? "With 5+ seats this went to sales as an MQL." : "Under 5 seats: nurtured, not routed to sales."}</p>
            )}
          </div>
        </div>
      </div>

      {sentTo && (
        <EmailPreview to={sentTo} subject={`Your Product School team proposal: ${q.seats} people, ${PLANS[planId].name}`}>
          <table className="w-full text-left text-sm">
            <tbody>
              <tr><td className="py-1 text-muted">Plan</td><td>{PLANS[planId].name}</td></tr>
              <tr><td className="py-1 text-muted">People</td><td>{q.seats}</td></tr>
              {focus && <tr><td className="py-1 text-muted">Focus</td><td>{courseBySlug(focus)?.title}</td></tr>}
              <tr><td className="py-1 text-muted">Per person</td><td>{usd(q.perSeat)} ({q.discountPct}% off {usd(q.listPerSeat)})</td></tr>
              <tr><td className="py-1 font-semibold">Total</td><td className="font-semibold">{usd(q.total)}</td></tr>
            </tbody>
          </table>
          <p>Included per person: {PLANS[planId].features.join(", ")}.</p>
          <p>A learning advisor will reach out within one business day to plan cohorts with you.</p>
        </EmailPreview>
      )}

      <HypothesisNote
        hypothesis="Showing a team price instantly, with the full proposal sent by email, makes enterprise buyers raise their hand instead of leaving to compare."
        metric="Team quote requests per calculator view, and the share with 5+ seats (MQLs)."
        guardrail="Enterprise sales-cycle length and win rate stay the same." />
    </div>
  );
}
