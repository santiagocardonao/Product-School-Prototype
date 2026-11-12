"use client";
import { useEffect, useState } from "react";
import EmailCapture from "@/components/EmailCapture";
import EmailPreview from "@/components/EmailPreview";
import HypothesisNote from "@/components/HypothesisNote";
import { courseBySlug } from "@/data/catalog";
import { PLANS, usd } from "@/data/pricing";
import { SAMPLE_RESULT, type AdvisorResult } from "@/lib/advisorSchema";
import { track } from "@/lib/track";

const EXAMPLES = [
  "I'm a senior PM at a fintech and I want to lead AI products in the next 6 months.",
  "I'm a marketing manager with no technical background. I want to switch into product.",
  "VP of Product. I need my team of 12 PMs to start shipping prototypes with AI.",
];

const ERRORS: Record<string, string> = {
  rate_limited: "Too many requests in a minute. Here's a sample path while you wait.",
  invalid_input: "Tell us a bit more (at least 10 characters, up to 600).",
};

export default function AdvisorPage() {
  const [text, setText] = useState("");
  const [team, setTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [notice, setNotice] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => { track("Advisor Viewed"); }, []);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setNotice(""); setResult(null); setSentTo(""); setIsSample(false);
    track("Advisor Submitted", { chars: text.length, team });
    const res = await fetch("/api/advisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, team }) }).catch(() => null);
    const json = await res?.json().catch(() => null);
    setLoading(false);
    if (json?.ok) {
      setResult(json.result); setMs(json.ms);
      track("Advisor Path Shown", { plan: json.result.recommendedPlan, courses: json.result.path.length, seniority: json.result.profile.seniority, buyerType: json.result.profile.buyerType, ms: json.ms });
    } else {
      if (json?.error === "invalid_input") { setNotice(ERRORS.invalid_input); return; }
      setNotice(ERRORS[json?.error] ?? "The advisor is unavailable right now. Here's a sample path so you can see the flow.");
      setResult(SAMPLE_RESULT); setMs(null); setIsSample(true);
      track("Advisor Fallback Shown", { error: json?.error ?? "network" });
    }
  }

  const plan = result && result.recommendedPlan !== "team_quote" ? PLANS[result.recommendedPlan] : null;

  return (
    <div className="pt-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">AI course advisor · real Claude call</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight">Not sure which course fits? Tell us where you are and where you want to go.</h1>

      <form onSubmit={run} className="mt-8 max-w-3xl rounded-card border border-line bg-surface p-5">
        <textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={600} rows={4}
          placeholder="Your role today, what you want to achieve, and by when."
          className="w-full resize-none rounded-field border border-line p-3 outline-none focus:border-primary" />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex} onClick={() => { setText(ex); setTeam(ex.includes("team")); track("Advisor Example Used"); }} className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-primary hover:text-primary">
              {ex.slice(0, 42)}…
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={team} onChange={(e) => setTeam(e.target.checked)} /> I&apos;m buying for a team</label>
          <span className="text-xs text-muted">{text.length}/600</span>
        </div>
        <button disabled={loading || text.trim().length < 10} className="mt-4 w-full rounded-field bg-primary px-5 py-3 font-semibold text-on-primary disabled:opacity-50 sm:w-auto">
          {loading ? "Building your path…" : "Build my learning path"}
        </button>
      </form>

      {notice && <p className="mt-4 max-w-3xl rounded-field bg-warning-soft px-4 py-3 text-sm">{notice}</p>}

      {loading && <div className="mt-8 grid max-w-3xl gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-card bg-line/60" />)}</div>}

      {result && (
        <section className="mt-8 max-w-3xl">
          <h2 className="font-display text-2xl font-bold">{result.headline}</h2>
          {!isSample && <p className="mt-1 text-sm text-muted">Read as: {result.profile.role} · {result.profile.seniority.replace("_", " ")} · goal: {result.profile.goal}{ms ? ` · built in ${(ms / 1000).toFixed(1)}s` : ""}</p>}
          <ol className="mt-5 space-y-3">
            {result.path.map((step, i) => {
              const c = courseBySlug(step.courseSlug);
              return (
                <li key={step.courseSlug} className="flex gap-4 rounded-card border border-line bg-surface p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-bold text-primary">{i + 1}</span>
                  <div><p className="font-semibold">{c?.title} <span className="text-xs font-normal text-muted">· {c?.level}</span></p><p className="text-sm text-muted">{step.why}</p></div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 rounded-card bg-accent-soft p-5">
            <p className="text-sm font-semibold text-primary">Recommended</p>
            {plan ? (
              <p className="mt-1 font-display text-xl font-bold">{plan.name} · {usd(plan.price)} <span className="text-sm font-normal">{plan.period}</span></p>
            ) : (
              <p className="mt-1 font-display text-xl font-bold">Team plan · <a href="/teams" className="text-primary underline">see your team price</a></p>
            )}
            <p className="mt-1 text-sm">{result.planReason}</p>
          </div>

          <div className="mt-6 rounded-card border border-line bg-surface p-5">
            {!sentTo ? (
              <>
                <p className="mb-3 font-semibold">{isSample ? "Leave your email and a learning advisor will build your path" : "Email me this path with the next cohort dates"}</p>
                <EmailCapture source="advisor" event="Advisor Email Captured" cta={isSample ? "Send me my path" : "Email me my path"}
                  data={isSample
                    // AI didn't run: never send the sample's profile. Send what the visitor wrote so sales can read it.
                    ? { aiPath: false, visitorText: text, buyingForTeam: team }
                    : { aiPath: true, role: result.profile.role, seniority: result.profile.seniority, goal: result.profile.goal, buyerType: result.profile.buyerType, teamSizeHint: result.profile.teamSizeHint, recommendedPlan: result.recommendedPlan, courses: result.path.map((p) => p.courseSlug) }}
                  onSent={setSentTo} />
              </>
            ) : (
              <p className="font-semibold text-success">{isSample
                ? `Got it, ${sentTo}. A learning advisor will read what you wrote and send you a personal path.`
                : `Path sent to ${sentTo}. The lead reached the CRM already qualified (open the data panel).`}</p>
            )}
          </div>

          {sentTo && !isSample && (
            <EmailPreview to={sentTo} subject={result.headline}>
              <p>Hi there, here&apos;s the path we built from what you told us:</p>
              <ol className="list-decimal pl-5">{result.path.map((p) => <li key={p.courseSlug}>{courseBySlug(p.courseSlug)?.title}</li>)}</ol>
              <p>Next cohorts start soon. Reply to this email if you want help choosing dates.</p>
            </EmailPreview>
          )}
        </section>
      )}

      <HypothesisNote
        hypothesis="An undecided visitor will trade an email for a personal learning path, and the lead arrives already qualified (role, seniority, goal, team or individual)."
        metric="Email capture rate among visitors who saw a path."
        guardrail="Checkout conversion from the pricing page doesn't drop; AI cost stays under $0.02 per run." />
    </div>
  );
}
