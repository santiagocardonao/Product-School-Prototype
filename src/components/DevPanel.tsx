"use client";
import { useState, useSyncExternalStore } from "react";
import { store } from "@/lib/track";

export default function DevPanel() {
  const { events, leads } = useSyncExternalStore(store.subscribe, store.get, store.server);
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,400px)] text-sm">
      {open && (
        <div className="mb-2 max-h-[60vh] overflow-auto rounded-[var(--radius-xl)] bg-white p-5 [box-shadow:var(--shadow-pop)]">
          <p className="ps-mono-meta uppercase">Leads → CRM <span className="normal-case">(HubSpot stand-in)</span></p>
          {leads.length === 0 && <p className="mb-3 mt-1 text-secondary">None yet.</p>}
          {leads.map((l, i) => (
            <pre key={i} className="mt-2 overflow-auto rounded-[var(--radius-lg)] bg-sunken p-3 font-mono text-[11px] leading-snug">{JSON.stringify({ source: l.source, ...l.payload }, null, 2)}</pre>
          ))}
          <p className="ps-mono-meta mt-4 uppercase">Events <span className="normal-case">(Segment stand-in)</span></p>
          {events.length === 0 && <p className="mt-1 text-secondary">None yet.</p>}
          <ul className="mt-2 space-y-1">
            {events.map((e, i) => (
              <li key={i} className="rounded-[var(--radius-xs)] bg-sunken px-2.5 py-1.5 font-mono text-[11px]">
                <span className="font-medium text-strong">{e.name}</span> <span className="text-muted">{JSON.stringify(e.props)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="ps-btn ps-btn-sm ml-auto flex bg-[var(--neutral-700)] font-mono text-[11px] uppercase text-white">
        {open ? "Close" : "Data panel"} · {events.length} events · {leads.length} leads
      </button>
    </div>
  );
}
