import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { AdvisorResult, SYSTEM_PROMPT, buildUserMessage } from "@/lib/advisorSchema";
import { allow, clientIp } from "@/lib/rateLimit";

export const maxDuration = 30;

const Input = z.object({ text: z.string().trim().min(10).max(600), team: z.boolean().default(false) });

export async function POST(req: Request) {
  const parsed = Input.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });

  if (!allow(`advisor:${clientIp(req)}`)) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ ok: false, error: "no_key" }, { status: 503 });

  // Keys not tied to a workspace need this header. The ID is not secret ("Default" workspace).
  const client = new Anthropic({
    defaultHeaders: { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID ?? "wrkspc_019ULFQphQs4KMRPeUB6NRLu" },
  });
  const started = Date.now();
  try {
    const res = await client.messages.parse({
      model: process.env.CLAUDE_MODEL ?? "claude-sonnet-5-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: buildUserMessage(parsed.data.text, parsed.data.team),
      }],
      output_config: { format: zodOutputFormat(AdvisorResult), effort: "low" },
    });
    if (res.stop_reason === "refusal" || !res.parsed_output) {
      return Response.json({ ok: false, error: "no_result" }, { status: 502 });
    }
    return Response.json({ ok: true, result: res.parsed_output, ms: Date.now() - started, usage: res.usage });
  } catch (err) {
    console.error("[advisor]", err instanceof Error ? err.message : err);
    return Response.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
