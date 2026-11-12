# Lead capture with public pricing · Product School prototype

Three flows that earn the visitor's email back after pricing went public. Built by Santiago Cardona as a thin working prototype. Not affiliated with Product School.

| Flow | Route | What's real |
|---|---|---|
| AI course advisor | `/advisor` | **Real Claude call** (structured output validated with Zod; courses can only come from the catalog) |
| Team pricing calculator | `/teams` | Real math; **team discounts are placeholders** |
| Email-first checkout | `/checkout?plan=pro` | Step 1 captures the email; payment is disabled |

**Stand-ins for your stack:** `src/data/*.ts` = Contentful · `track()` = Segment · `src/lib/flags.ts` = LaunchDarkly · `/api/lead` = HubSpot (logs only, nothing stored) · email previews = transactional email. The "Data panel" (bottom right) shows every event and lead payload.

Run: `npm i && npm run dev` with `ANTHROPIC_API_KEY` in `.env.local`. Design tokens live in `src/styles/tokens.css`.
