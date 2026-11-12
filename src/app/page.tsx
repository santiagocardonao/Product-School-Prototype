import TrackLink from "@/components/TrackLink";
import { PLANS, usd } from "@/data/pricing";

export default function Home() {
  return (
    <div className="pt-8">
      <section className="max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Keep pricing public. Capture leads anyway.</p>
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Give visitors a reason to leave their email, without hiding the price.</h1>
        <p className="mt-4 text-lg text-muted">Publishing prices removed the checkout step that used to collect emails, so MQLs dropped. These three flows earn the email back by giving something useful first.</p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          { href: "/advisor", n: "1", title: "AI course advisor", body: "Visitors describe their role and goal. Claude builds a personal learning path from the real catalog. The path is emailed, and the lead arrives qualified.", tag: "Both audiences · real AI" },
          { href: "/teams", n: "2", title: "Team pricing calculator", body: "“How many people?” returns a team price instantly. The full proposal goes by email, and 5+ seats reach sales as an MQL.", tag: "Enterprise" },
          { href: "/checkout?plan=pro", n: "3", title: "Email-first checkout", body: "Step one asks only for the email, so abandoned checkouts become leads you can recover.", tag: "Easiest to ship" },
        ].map((c) => (
          <TrackLink key={c.href} href={c.href} event="Flow Card Clicked" props={{ flow: c.title }} className="group rounded-card border border-line bg-surface p-6 transition hover:border-primary">
            <p className="text-xs font-semibold text-muted">{c.n} · {c.tag}</p>
            <h2 className="mt-2 font-display text-xl font-bold group-hover:text-primary">{c.title} →</h2>
            <p className="mt-2 text-sm text-muted">{c.body}</p>
          </TrackLink>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Public pricing stays visible</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {Object.values(PLANS).map((p) => (
            <div key={p.id} className="flex flex-col rounded-card border border-line bg-surface p-6">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-2 font-display text-3xl font-bold">{usd(p.price)} <span className="text-sm font-normal text-muted">{p.period}</span></p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-muted">{p.features.map((f) => <li key={f}>· {f}</li>)}</ul>
              <TrackLink href={`/checkout?plan=${p.id}`} event="Plan Selected" props={{ plan: p.id }} className="mt-5 rounded-field bg-primary px-4 py-2.5 text-center font-semibold text-on-primary">Enroll</TrackLink>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Buying for 5+ people? <TrackLink href="/teams" event="Team Link Clicked" props={{ from: "home" }} className="font-semibold text-primary">Get a team price in 10 seconds</TrackLink></p>
      </section>
    </div>
  );
}
