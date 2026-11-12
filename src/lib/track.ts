"use client";
// Stand-in for Segment: Segment-style event names, logged to the console and the dev panel.
export type TrackedEvent = { name: string; props: Record<string, unknown>; at: string };
export type SentLead = { source: string; payload: Record<string, unknown>; at: string };

type State = { events: TrackedEvent[]; leads: SentLead[] };
const state: State = { events: [], leads: [] };
const listeners = new Set<() => void>();
let snapshot: State = { events: [], leads: [] };

const emit = () => {
  snapshot = { events: [...state.events], leads: [...state.leads] };
  listeners.forEach((l) => l());
};

export function track(name: string, props: Record<string, unknown> = {}) {
  const e = { name, props, at: new Date().toISOString() };
  state.events.unshift(e);
  console.log("[analytics.track]", name, props);
  emit();
}

export function recordLead(source: string, payload: Record<string, unknown>) {
  state.leads.unshift({ source, payload, at: new Date().toISOString() });
  emit();
}

export const store = {
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  get: () => snapshot,
  server: () => snapshot,
};
