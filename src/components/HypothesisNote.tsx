export default function HypothesisNote({ hypothesis, metric, guardrail, ship }: { hypothesis: string; metric: string; guardrail: string; ship: string }) {
  return (
    <aside className="mt-16 bg-sunken p-6 md:p-8">
      <span className="ps-eyebrow">How we&apos;d test it</span>
      <dl className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[["Hypothesis", hypothesis], ["Primary metric", metric], ["Guardrail", guardrail]].map(([k, v]) => (
          <div key={k}>
            <dt className="ps-mono-meta uppercase">{k}</dt>
            <dd className="mt-1.5 text-[15px] font-[350] leading-relaxed text-ink">{v}</dd>
          </div>
        ))}
        <div className="bg-white p-4 [box-shadow:var(--shadow-card-tint)]">
          <dt className="ps-mono-meta uppercase text-primary">Ship if</dt>
          <dd className="mt-1.5 text-[15px] font-medium leading-relaxed text-strong">{ship}</dd>
        </div>
      </dl>
    </aside>
  );
}
