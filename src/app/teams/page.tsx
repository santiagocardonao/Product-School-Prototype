"use client";
import { useEffect, useRef, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import PageIntro from "@/components/PageIntro";
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

  useEffect(() => {
    const s = Number(new URLSearchParams(window.location.search).get("seats"));
    if (s > 0) setSeats(Math.min(500, s));
    track("Team Calculator Viewed", { prefilledSeats: s || null });
  }, []);
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => track("Team Quote Calculated", { seats: q.seats, plan: planId, total: q.total }), 800);
  }, [q.seats, planId, q.total]);

  return (
    <div className="ps-section bg-canvas">
      <div className="ps-container">
        <PageIntro eyebrow="For teams" title="Upskill your product team." accent="See the price now."
          lede="No call needed to get a number. Pick the team size and plan; the full proposal is one email away." />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="ps-card space-y-6 p-6 md:p-7">
            <div>
              <label htmlFor="seats" className="ps-label">How many people?</label>
              <div className="flex items-center gap-4">
                <input id="seats-range" aria-label="Team size slider" type="range" min={1} max={100} value={Math.min(seats, 100)} onChange={(e) => setSeats(+e.target.value)} className="flex-1 accent-[var(--primary-200)]" />
                <input id="seats" type="number" min={1} max={500} value={seats} onChange={(e) => setSeats(+e.target.value)} className="ps-input w-24 text-center font-mono" />
              </div>
            </div>
            <div>
              <label htmlFor="plan" className="ps-label">Plan</label>
              <select id="plan" value={planId} onChange={(e) => setPlanId(e.target.value as PlanId)} className="ps-select">
                {Object.values(PLANS).map((p) => <option key={p.id} value={p.id}>{p.name} · {usd(p.price)} {p.period}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="focus" className="ps-label">Focus course <span className="font-normal text-secondary">(optional)</span></label>
              <select id="focus" value={focus} onChange={(e) => setFocus(e.target.value)} className="ps-select">
                <option value="">No preference</option>
                {CATALOG.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <div className="bg-warning-soft px-4 py-3 text-[13px] text-warning-ink">
              <span className="ps-badge ps-badge--popular mr-2">Placeholder</span>
              Team pricing isn&apos;t public; these tiers are invented: {TEAM_TIERS.map((t) => `${t.min}${t.max === Infinity ? "+" : `–${t.max}`}: ${t.discount * 100}%`).join(" · ")}
            </div>
          </div>

          <div className="ps-panel p-6 md:p-8">
            <p className="ps-mono-meta uppercase">{q.seats} {q.seats === 1 ? "person" : "people"} · {PLANS[planId].name}</p>
            <p className="ps-stat mt-3 text-[64px]">{usd(q.total)}</p>
            <p className="ps-body mt-3 text-[15px]">{usd(q.perSeat)} per person {PLANS[planId].period}</p>
            {q.discountPct > 0 && (
              <p className="mt-3 flex flex-wrap gap-2"><span className="ps-badge ps-badge--new">{q.discountPct}% team discount</span><span className="ps-badge ps-badge--neutral">You save {usd(q.savings)}</span></p>
            )}
            {q.talkToSales && <p className="mt-4 text-sm font-medium text-primary">50+ people: a learning advisor can build a custom program.</p>}

            <div className="mt-7 pt-6 [box-shadow:var(--divider-top)]">
              {!sentTo ? (
                <>
                  <p className="ps-title mb-3 text-[17px]">Email me the full proposal</p>
                  <EmailCapture source="team_calculator" event="Team Quote Requested" cta="Send me the proposal" withCompany
                    data={{ seats: q.seats, plan: planId, focusCourse: focus || null, total: q.total, perSeat: q.perSeat, discountPct: q.discountPct, mql: q.isMql, mqlReason: q.isMql ? "team_5plus" : null }}
                    onSent={setSentTo} />
                </>
              ) : (
                <p className="font-medium text-success">✓ Proposal sent to {sentTo}. {q.isMql ? "With 5+ seats this went to sales as an MQL." : "Under 5 seats: nurtured, not routed to sales."}</p>
              )}
            </div>
          </div>
        </div>

        {sentTo && (
          <EmailPreview to={sentTo} subject={`Your Product School team proposal: ${q.seats} people, ${PLANS[planId].name}`}>
            <table className="w-full text-left text-[15px]">
              <tbody>
                <tr><td className="ps-mono-meta py-1.5">Plan</td><td>{PLANS[planId].name}</td></tr>
                <tr><td className="ps-mono-meta py-1.5">People</td><td>{q.seats}</td></tr>
                {focus && <tr><td className="ps-mono-meta py-1.5">Focus</td><td>{courseBySlug(focus)?.title}</td></tr>}
                <tr><td className="ps-mono-meta py-1.5">Per person</td><td>{usd(q.perSeat)} ({q.discountPct}% off {usd(q.listPerSeat)})</td></tr>
                <tr><td className="ps-mono-meta py-1.5">Total</td><td className="font-medium text-strong">{usd(q.total)}</td></tr>
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
    </div>
  );
}
