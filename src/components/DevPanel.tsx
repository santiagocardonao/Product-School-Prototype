"use client";
import { useState, useSyncExternalStore } from "react";
import { store } from "@/lib/track";

export default function DevPanel() {
  const { events, leads } = useSyncExternalStore(store.subscribe, store.get, store.server);
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,380px)] text-sm">
      {open && (
        <div className="mb-2 max-h-[60vh] overflow-auto rounded-card border border-line bg-surface p-4 shadow-xl">
          <p className="mb-1 font-semibold">Leads sent to CRM <span className="font-normal text-muted">(HubSpot stand-in)</span></p>
          {leads.length === 0 && <p className="mb-3 text-muted">None yet.</p>}
          {leads.map((l, i) => (
            <pre key={i} className="mb-2 overflow-auto rounded-field bg-canvas p-2 text-xs">{JSON.stringify({ source: l.source, ...l.payload }, null, 2)}</pre>
          ))}
          <p className="mb-1 mt-3 font-semibold">Tracked events <span className="font-normal text-muted">(Segment stand-in)</span></p>
          {events.length === 0 && <p className="text-muted">None yet.</p>}
          <ul className="space-y-1">
            {events.map((e, i) => (
              <li key={i} className="rounded-field bg-canvas px-2 py-1 text-xs">
                <span className="font-semibold">{e.name}</span>{" "}
                <span className="text-muted">{JSON.stringify(e.props)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="ml-auto block rounded-full bg-ink px-4 py-2 text-xs font-medium text-surface shadow-lg">
        {open ? "Close" : "Data panel"} · {events.length} events · {leads.length} leads
      </button>
    </div>
  );
}
