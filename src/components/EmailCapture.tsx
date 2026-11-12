"use client";
import { useState } from "react";
import { track, recordLead } from "@/lib/track";

type Props = {
  source: "advisor" | "team_calculator" | "checkout";
  data: Record<string, unknown>;
  cta: string;
  event: string;
  withCompany?: boolean;
  onSent: (email: string) => void;
};

export default function EmailCapture({ source, data, cta, event, withCompany, onSent }: Props) {
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

  const field = "w-full rounded-field border border-line bg-surface px-3 py-2.5 outline-none focus:border-primary";
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className={withCompany ? "grid gap-3 sm:grid-cols-3" : ""}>
        <input type="email" required placeholder={withCompany ? "Work email" : "Your email"} value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        {withCompany && <input required placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className={field} />}
        {withCompany && <input placeholder="Your role (optional)" value={role} onChange={(e) => setRole(e.target.value)} className={field} />}
      </div>
      <button disabled={busy} className="w-full rounded-field bg-primary px-5 py-3 font-semibold text-on-primary disabled:opacity-60 sm:w-auto">
        {busy ? "Sending…" : cta}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-muted">Prototype: use a test email. Nothing is stored or sent.</p>
    </form>
  );
}
