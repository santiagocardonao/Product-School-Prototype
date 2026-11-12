export default function EmailPreview({ to, subject, children }: { to: string; subject: string; children: React.ReactNode }) {
  return (
    <div className="ps-panel mt-6 overflow-hidden">
      <div className="bg-sunken px-6 py-4">
        <p className="ps-mono-meta">TO · {to}</p>
        <p className="mt-1 text-[15px] font-medium text-strong">{subject}</p>
        <p className="mt-2"><span className="ps-badge ps-badge--neutral">Preview · not actually sent</span></p>
      </div>
      <div className="space-y-3 px-6 py-5 text-[15px] font-[350] leading-relaxed text-ink">{children}</div>
    </div>
  );
}
