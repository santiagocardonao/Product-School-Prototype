export default function HypothesisNote({ hypothesis, metric, guardrail }: { hypothesis: string; metric: string; guardrail: string }) {
  return (
    <aside className="mt-16 bg-sunken p-6 md:p-8">
      <span className="ps-eyebrow">How we&apos;d test it</span>
      <dl className="mt-5 grid gap-5 md:grid-cols-3">
        {[["Hypothesis", hypothesis], ["Primary metric", metric], ["Guardrail", guardrail]].map(([k, v]) => (
          <div key={k}>
            <dt className="ps-mono-meta uppercase">{k}</dt>
            <dd className="mt-1.5 text-[15px] font-[350] leading-relaxed text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
