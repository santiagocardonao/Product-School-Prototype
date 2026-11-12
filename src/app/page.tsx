import TrackLink from "@/components/TrackLink";
import Shield from "@/components/Shield";
import { PLANS, usd } from "@/data/pricing";

const FLOWS = [
  { href: "/advisor", n: "01", tag: "Both audiences · real AI", title: "AI course advisor", body: "Visitors describe their role and goal. Claude builds a personal path from the real catalog, then emails it. The lead arrives qualified." },
  { href: "/teams", n: "02", tag: "Enterprise", title: "Team pricing calculator", body: "“How many people?” returns a team price instantly. The full proposal goes by email, and 5+ seats reach sales as an MQL." },
  { href: "/checkout?plan=pro", n: "03", tag: "Easiest to ship", title: "Email-first checkout", body: "Step one asks only for the email, so abandoned checkouts become leads you can recover." },
];

function Collage() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[540px]" aria-hidden="true">
      {/* blueprint connectors */}
      <div className="absolute left-[4%] top-10 h-[300px] w-px bg-white/30" />
      <div className="absolute left-[4%] top-10 h-px w-[46%] bg-white/30" />
      {[["3.4%", 34], ["49.6%", 34], ["3.4%", 334]].map(([l, t], i) => (
        <span key={i} className="absolute h-[7px] w-[7px] border border-white/50 bg-white" style={{ left: l as string, top: t as number }} />
      ))}
      {/* advisor input card */}
      <div className="absolute left-[7%] top-4 w-[64%] rounded-[var(--radius-xl)] bg-white p-5 text-ink [box-shadow:var(--shadow-float)]">
        <p className="ps-mono-meta text-[11px] uppercase">AI course advisor</p>
        <p className="mt-3 text-[15px] font-[350] leading-snug">“Senior PM at a fintech. I want to lead AI products in 6 months.”</p>
        <div className="mt-4 space-y-2">
          {["AI Product Management", "AI Evals", "AI Product Strategy"].map((c, i) => (
            <div key={c} className="flex items-center gap-2.5 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-[var(--radius-xs)] bg-primary-tint font-mono text-[10px] text-primary">{i + 1}</span>{c}
            </div>
          ))}
        </div>
      </div>
      {/* team price card */}
      <div className="absolute right-0 top-[168px] w-[46%] rounded-[var(--radius-xl)] bg-white p-5 [box-shadow:var(--shadow-float)]">
        <p className="ps-mono-meta text-[11px] uppercase">12 people · Pro</p>
        <p className="mt-2 font-mono text-[34px] leading-none tracking-[-0.06em] text-strong">$40,788</p>
        <p className="mt-2 text-xs text-secondary">15% team discount</p>
        <span className="ps-badge ps-badge--new mt-3">MQL · 5+ seats</span>
      </div>
      {/* lead chip */}
      <div className="absolute bottom-2 left-[4%] flex w-[60%] items-center gap-3 rounded-[var(--radius-lg)] bg-white px-4 py-3 [box-shadow:var(--shadow-pop)]">
        <span className="h-2 w-2 rounded-full bg-[var(--success-300)]" />
        <div>
          <p className="text-[13px] font-medium text-strong">Lead → CRM, qualified</p>
          <p className="font-mono text-[11px] text-primary">senior · AI PM · individual</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="ps-mesh ps-on-color px-[var(--section-pad-x)] pb-[var(--section-pad-y)] pt-[var(--hero-pad-top)]">
        <Shield className="-right-[6%] -top-[8%] z-0 h-[125%] w-auto" />
        <div className="ps-container grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <span className="ps-eyebrow ps-eyebrow--gradient">Lead capture prototype</span>
            <h1 className="mt-6 max-w-[600px] font-normal text-white [font-size:var(--text-display-xl)] [line-height:var(--leading-display)] [letter-spacing:var(--tracking-display)] [text-shadow:var(--text-shadow-hero)]">
              Keep pricing public. Capture the lead anyway
            </h1>
            <p className="mt-6 max-w-[500px] font-light leading-[1.55] text-white/90">
              Publishing prices removed the checkout step that used to collect emails, so MQLs dropped. These three flows earn the email back by giving something useful first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackLink href="/advisor" event="Hero CTA Clicked" props={{ cta: "advisor" }} className="ps-btn ps-btn-inverse ps-btn-lg">Find my course</TrackLink>
              <TrackLink href="/teams" event="Hero CTA Clicked" props={{ cta: "teams" }} className="ps-btn ps-btn-ghost-on-color ps-btn-lg">Get a team price</TrackLink>
            </div>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.08em] text-white/80">Real Claude call · Next.js on Vercel · built in an afternoon</p>
          </div>
          <Collage />
        </div>
      </section>

      <section className="ps-section bg-white">
        <div className="ps-container">
          <span className="ps-eyebrow">Three bets</span>
          <h2 className="ps-h2 mt-5 max-w-3xl">Give something useful first. <span className="ps-accent">The email follows.</span></h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FLOWS.map((c) => (
              <TrackLink key={c.href} href={c.href} event="Flow Card Clicked" props={{ flow: c.title }} className="ps-card-tint ps-card-link group flex flex-col p-7">
                <span className="font-mono text-[40px] leading-none tracking-[-0.06em] text-primary">{c.n}</span>
                <span className="ps-mono-meta mt-6 uppercase">{c.tag}</span>
                <span className="ps-title mt-2">{c.title}</span>
                <span className="ps-body mt-2 flex-1 text-[15px] leading-relaxed">{c.body}</span>
                <span className="ps-link-arrow mt-6 text-sm">Try it</span>
              </TrackLink>
            ))}
          </div>
        </div>
      </section>

      <section className="ps-section bg-sunken">
        <div className="ps-container">
          <span className="ps-eyebrow">Pricing stays public</span>
          <h2 className="ps-h2 mt-5">Simple, transparent pricing. <span className="ps-accent">Visible before any email.</span></h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Object.values(PLANS).map((p) => (
              <div key={p.id} className={`flex flex-col p-7 ${p.id === "pro" ? "ps-panel" : "ps-card"}`}>
                <div className="flex items-center gap-2">
                  <span className="ps-title">{p.name}</span>
                  {p.id === "pro" && <span className="ps-badge ps-badge--popular">Most popular</span>}
                </div>
                <p className="mt-4 flex items-baseline gap-2"><span className="ps-stat text-[44px]">{usd(p.price)}</span><span className="ps-mono-meta">{p.period}</span></p>
                <ul className="mt-6 flex-1 space-y-2.5 text-[15px] font-[350] text-ink">
                  {p.features.map((f) => <li key={f} className="flex gap-2.5"><span className="text-primary">✓</span>{f}</li>)}
                </ul>
                <TrackLink href={`/checkout?plan=${p.id}`} event="Plan Selected" props={{ plan: p.id }} className={`ps-btn ps-btn-lg mt-7 ${p.id === "pro" ? "ps-btn-primary" : "ps-btn-outline"}`}>Get started</TrackLink>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-ink">Buying for 5+ people? <TrackLink href="/teams" event="Team Link Clicked" props={{ from: "home" }} className="ps-link-arrow">Get a team price in 10 seconds</TrackLink></p>
        </div>
      </section>

      <section className="ps-mesh ps-on-color px-[var(--section-pad-x)] py-[var(--section-pad-y)]">
        <Shield className="-left-[4%] -top-[30%] z-0 h-[160%] w-auto" />
        <div className="ps-container flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-2xl font-normal text-white [font-size:var(--text-h2)] [line-height:var(--leading-tight)] [letter-spacing:var(--tracking-display)]">Not sure where to start? Let the advisor build your path</h2>
          <TrackLink href="/advisor" event="Final CTA Clicked" className="ps-btn ps-btn-inverse ps-btn-lg">Build my learning path</TrackLink>
        </div>
      </section>
    </>
  );
}
