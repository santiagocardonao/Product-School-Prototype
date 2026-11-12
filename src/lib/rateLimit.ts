// Tiny in-memory limiter (per serverless instance). Good enough for a public demo.
const hits = new Map<string, number[]>();
export function allow(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) { hits.set(key, recent); return false; }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

// On Vercel the first x-forwarded-for entry is the client IP (set by the platform).
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
