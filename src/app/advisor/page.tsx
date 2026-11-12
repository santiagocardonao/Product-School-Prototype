"use client";
import { useEffect, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import PageIntro from "@/components/PageIntro";
import { courseBySlug } from "@/data/catalog";
import { PLANS, usd } from "@/data/pricing";
import { SAMPLE_RESULT, type AdvisorResult } from "@/lib/advisorSchema";
import { track } from "@/lib/track";

const EXAMPLES = [
  { label: "Senior PM → AI PM", text: "I'm a senior PM at a fintech and I want to lead AI products in the next 6 months.", team: false },
  { label: "Marketer → PM", text: "I'm a marketing manager with no technical background. I want to switch into product.", team: false },
  { label: "VP with 12 PMs", text: "VP of Product. I need my team of 12 PMs to start shipping prototypes with AI.", team: true },
];

export default function AdvisorPage() {
  const [text, setText] = useState("");
  const [team, setTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [notice, setNotice] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => { track("Advisor Viewed"); }, []);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setNotice(""); setResult(null); setSentTo("");
    track("Advisor Submitted", { chars: text.length, team });
    const res = await fetch("/api/advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, team }) }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setLoading(false);
    if (json?.ok) {
      setResult(json.result); setMs(json.ms);
      track("Advisor Path Shown", { plan: json.result.recommendedPlan, courses: json.result.path.length, seniority: json.result.profile.seniority, buyerType: json.result.profile.buyerType, ms: json.ms });
      return;
    }
    if (json?.error === "invalid_input") { setNotice("Tell us a bit more: at least 10 characters, up to 600."); return; }
    setNotice(json?.error === "rate_limited" ? "Too many requests in a minute. Here's a sample path while you wait." : "The advisor is unavailable right now. Here's a sample path so you can see the flow.");
    setResult(SAMPLE_RESULT); setMs(null);
    track("Advisor Fallback Shown", { error: json?.error ?? "network" });
  }

  const plan = result && result.recommendedPlan !== "team_quote" ? PLANS[result.recommendedPlan] : null;

  return (
    <div className="ps-section bg-canvas">
      <div className="ps-container">
        <PageIntro eyebrow="AI course advisor" title="Not sure which course fits?" accent="Tell us where you want to go."
          lede="Describe your role and your goal. A real Claude call builds your path from the live catalog, with prices visible before we ask for anything." />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={run} className="ps-panel h-fit p-6 md:p-7">
            <label htmlFor="goal" className="ps-label">Your role today and what you want to achieve</label>
            <textarea id="goal" value={text} onChange={(e) => setText(e.target.value)} maxLength={600} rows={5}
              placeholder="e.g. I'm a senior PM and I want to lead AI products within 6 months."
              className="ps-textarea" />
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button type="button" key={ex.label} onClick={() => { setText(ex.text); setTeam(ex.team); track("Advisor Example Used", { example: ex.label }); }}
                  className="ps-btn ps-btn-outline ps-btn-sm font-mono text-[12px]">{ex.label}</button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 text-sm text-ink">
                <input type="checkbox" checked={team} onChange={(e) => setTeam(e.target.checked)} className="h-4 w-4 accent-[var(--primary-200)]" />
                I&apos;m buying for a team
              </label>
              <span className="ps-mono-meta text-xs">{text.length}/600</span>
            </div>
            <button disabled={loading || text.trim().length < 10} className="ps-btn ps-btn-primary ps-btn-lg mt-6 w-full">
              {loading ? "Building your path…" : "Build my learning path"}
            </button>
          </form>

          <div>
            {notice && <p className="mb-4 rounded-[var(--radius-lg)] bg-warning-soft px-4 py-3 text-sm text-warning-ink">{notice}</p>}
            {!result && !loading && (
              <div className="flex h-full min-h-[280px] flex-col justify-center rounded-[var(--radius-xl)] border border-dashed border-[var(--neutral-150)] p-8 text-center">
                <p className="ps-mono-meta uppercase">Your path appears here</p>
                <p className="ps-body mt-2 text-[15px]">2–4 courses in order, the plan that fits, and why.</p>
              </div>
            )}
            {loading && <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-[var(--neutral-50)]" />)}</div>}

            {result && (
              <section>
                <h2 className="ps-h3">{result.headline}</h2>
                <p className="ps-mono-meta mt-2 text-[12px]">{result.profile.role} · {result.profile.seniority.replace("_", " ")}{ms ? ` · built in ${(ms / 1000).toFixed(1)}s` : " · sample"}</p>
                <ol className="ps-card mt-5 px-5">
                  {result.path.map((step, i) => {
                    const c = courseBySlug(step.courseSlug);
                    return (
                      <li key={step.courseSlug} className="ps-row">
                        <span className="font-mono text-[28px] leading-none tracking-[-0.06em] text-primary">{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <p className="flex flex-wrap items-center gap-2"><span className="ps-title text-[17px]">{c?.title}</span><span className="ps-badge ps-badge--neutral">{c?.level}</span></p>
                          <p className="ps-body mt-1 text-[15px] leading-relaxed">{step.why}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-5 bg-primary-soft p-5">
                  <p className="ps-mono-meta uppercase text-primary">Recommended plan</p>
                  {plan ? (
                    <p className="mt-2 flex items-baseline gap-2"><span className="ps-title">{plan.name}</span><span className="font-mono text-xl tracking-[-0.04em] text-strong">{usd(plan.price)}</span><span className="ps-mono-meta">{plan.period}</span></p>
                  ) : (
                    <p className="mt-2"><span className="ps-title">Team plan</span> · <a href={`/teams${result.profile.teamSizeHint ? `?seats=${result.profile.teamSizeHint}` : ""}`} className="ps-link-arrow">See your team price</a></p>
                  )}
                  <p className="ps-body mt-1.5 text-[15px]">{result.planReason}</p>
                </div>

                <div className="ps-card mt-5 p-5">
                  {!sentTo ? (
                    <>
                      <p className="ps-title mb-3 text-[17px]">Email me this path with the next cohort dates</p>
                      <EmailCapture source="advisor" event="Advisor Email Captured" cta="Email me my path"
                        data={{ role: result.profile.role, seniority: result.profile.seniority, goal: result.profile.goal, buyerType: result.profile.buyerType, teamSizeHint: result.profile.teamSizeHint, recommendedPlan: result.recommendedPlan, courses: result.path.map((p) => p.courseSlug) }}
                        onSent={setSentTo} />
                    </>
                  ) : (
                    <p className="font-medium text-success">✓ Path sent to {sentTo}. The lead reached the CRM already qualified. Open the data panel to see it.</p>
                  )}
                </div>

                {sentTo && (
                  <EmailPreview to={sentTo} subject={result.headline}>
                    <p>Hi, here&apos;s the path we built from what you told us:</p>
                    <ol className="list-decimal pl-5">{result.path.map((p) => <li key={p.courseSlug}>{courseBySlug(p.courseSlug)?.title}</li>)}</ol>
                    <p>Next cohorts start soon. Reply to this email if you want help choosing dates.</p>
                  </EmailPreview>
                )}
              </section>
            )}
          </div>
        </div>

        <HypothesisNote
          hypothesis="An undecided visitor will trade an email for a personal learning path, and the lead arrives already qualified (role, seniority, goal, team or individual)."
          metric="Email capture rate among visitors who saw a path."
          guardrail="Checkout conversion from the pricing page doesn't drop; AI cost stays under $0.02 per run." />
      </div>
    </div>
  );
}
