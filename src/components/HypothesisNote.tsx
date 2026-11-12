export default function HypothesisNote({ hypothesis, metric, guardrail }: { hypothesis: string; metric: string; guardrail: string }) {
  return (
    <aside className="mt-12 rounded-card border border-dashed border-line p-5 text-sm text-muted">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink">How we&apos;d test this</p>
      <p><span className="font-semibold text-ink">Hypothesis:</span> {hypothesis}</p>
      <p><span className="font-semibold text-ink">Primary metric:</span> {metric}</p>
      <p><span className="font-semibold text-ink">Guardrail:</span> {guardrail}</p>
    </aside>
  );
}
