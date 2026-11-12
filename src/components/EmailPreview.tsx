export default function EmailPreview({ to, subject, children }: { to: string; subject: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 overflow-hidden rounded-card border border-line bg-surface">
      <div className="border-b border-line bg-canvas px-5 py-3 text-xs text-muted">
        <p><span className="font-semibold text-ink">To:</span> {to}</p>
        <p><span className="font-semibold text-ink">Subject:</span> {subject}</p>
        <p className="mt-1 italic">Email preview. Nothing is actually sent in this prototype.</p>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm">{children}</div>
    </div>
  );
}
