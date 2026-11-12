# Lead capture with public pricing · Product School prototype

Three flows that earn the visitor's email back after pricing went public. Built by Santiago Cardona as a thin working prototype. Not affiliated with Product School.

| Flow | Route | What's real |
|---|---|---|
| AI course advisor | `/advisor` | **Real Claude call** (structured output validated with Zod; courses can only come from the catalog) |
| Team pricing calculator | `/teams` | Real math; **team discounts are placeholders** |
| Email-first checkout | `/checkout/pro` | Step 1 captures the email; payment is disabled |

**Stand-ins for your stack:** `src/data/*.ts` = Contentful · `track()` = Segment · `src/lib/flags.ts` = LaunchDarkly · `/api/lead` = HubSpot (logs only, nothing stored) · email previews = transactional email. The "Data panel" (bottom right) shows every event and lead payload.

**Feature flags** (`src/lib/flags.ts`, all `true` in production). Each flow ships behind one so it can run as an A/B test:

| Flag | Controls | When `false` |
|---|---|---|
| `advisor` | `/advisor` | Page returns 404; hidden from the nav and the home cards |
| `teamCalculator` | `/teams` | Page returns 404; hidden from the nav and the home cards |
| `emailFirstCheckout` | `/checkout/*` | Control arm: no email step, straight to payment. Its home card is hidden; the pricing buttons and the nav still lead to checkout. `Checkout Started` carries `variant: "control"` instead of `"email_first"` |

Flags are build-time constants: change the value and redeploy. A real setup would read them per visitor from LaunchDarkly.

**Visits:** Vercel Web Analytics (`<Analytics />` in `src/app/layout.tsx`) counts page views in the Vercel dashboard. The funnel events from `track()` stay in the Data panel only.

**Limits (per IP, per serverless instance, in memory):**

| Endpoint | Rate limit | Input limits | When blocked |
|---|---|---|---|
| `POST /api/advisor` | 5 requests / minute | text 10–600 characters | 429; the page shows a sample path |
| `POST /api/lead` | 10 leads / minute | valid email ≤ 200 characters; `data` ≤ 2,000 characters as JSON | 429; the form asks the visitor to wait a moment |

Each endpoint has its own budget. Good enough to stop scripts on a public demo; production would use a shared store (e.g. Redis) instead.

Run: `npm i && npm run dev` with `ANTHROPIC_API_KEY` in `.env.local`. Design system: tokens and components in `src/styles/ps/` (Inter + JetBrains Mono, primary-200 #2758E2, mesh hero, ps-* components).
