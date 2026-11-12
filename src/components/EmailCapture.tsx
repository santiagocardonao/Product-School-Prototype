"use client";
import { useState } from "react";
import { track, recordLead } from "@/lib/track";

type Props = {
  source: "advisor" | "team_calculator" | "checkout";
  data: Record<string, unknown>;
  cta: string;
  event: string;
  withCompany?: boolean;
  hint?: string;
  onSent: (email: string) => void;
};

export default function EmailCapture({ source, data, cta, event, withCompany, hint, onSent }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const payload = { ...data, ...(withCompany ? { company, role } : {}) };
    const res = await fetch("/api/lead", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, data: payload }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) { setError("Please check the email and try again."); return; }
    track(event, { source, ...payload });
    recordLead(source, { email, ...payload });
    onSent(email);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className={withCompany ? "grid gap-3 sm:grid-cols-3" : ""}>
        <input type="email" required aria-label="Email" placeholder={withCompany ? "Work email" : "you@company.com"} value={email} onChange={(e) => setEmail(e.target.value)} className="ps-input" />
        {withCompany && <input required aria-label="Company" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="ps-input" />}
        {withCompany && <input aria-label="Role" placeholder="Your role (optional)" value={role} onChange={(e) => setRole(e.target.value)} className="ps-input" />}
      </div>
      <button disabled={busy} className="ps-btn ps-btn-primary ps-btn-lg w-full sm:w-auto">{busy ? "Sending…" : cta}</button>
      {error && <p role="alert" className="text-xs text-[var(--error-300)]">{error}</p>}
      {hint && <p className="text-sm text-ink">{hint}</p>}
      <p className="text-xs text-secondary">Prototype: use a test email. Nothing is stored or sent.</p>
    </form>
  );
}
