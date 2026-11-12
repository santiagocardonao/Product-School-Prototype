import { z } from "zod";

// Stand-in for HubSpot: validates the lead and logs it (visible in Vercel logs). Nothing is stored.
const Lead = z.object({
  email: z.string().email().max(200),
  source: z.enum(["advisor", "team_calculator", "checkout"]),
  data: z.record(z.string(), z.unknown()).default({}),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Lead.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_lead" }, { status: 400 });
  const lead = { ...parsed.data, leadId: crypto.randomUUID(), receivedAt: new Date().toISOString() };
  console.log("[crm.createLead]", JSON.stringify(lead));
  return Response.json({ ok: true, leadId: lead.leadId });
}
