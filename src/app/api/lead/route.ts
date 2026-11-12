import { z } from "zod";
import { allow, clientIp } from "@/lib/rateLimit";

const MAX_DATA_CHARS = 2000;

// Stand-in for HubSpot: validates the lead and logs it (visible in Vercel logs). Nothing is stored.
const Lead = z.object({
  email: z.string().email().max(200),
  source: z.enum(["advisor", "team_calculator", "checkout"]),
  // Flow context (plan, seats, path…). Capped so nobody can flood the logs with a huge payload.
  data: z.record(z.string(), z.unknown()).default({})
    .refine((d) => JSON.stringify(d).length <= MAX_DATA_CHARS, "data_too_large"),
});

export async function POST(req: Request) {
  // Real flows send one lead per visit; 10 a minute per IP leaves room for demos and blocks scripts.
  if (!allow(`lead:${clientIp(req)}`, 10)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  const body = await req.json().catch(() => null);
  const parsed = Lead.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_lead" }, { status: 400 });
  const lead = { ...parsed.data, leadId: crypto.randomUUID(), receivedAt: new Date().toISOString() };
  console.log("[crm.createLead]", JSON.stringify(lead));
  return Response.json({ ok: true, leadId: lead.leadId });
}
