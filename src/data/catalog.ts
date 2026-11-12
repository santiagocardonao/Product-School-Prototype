// Stand-in for Contentful: same shape a "Course" content model would have.
export const CATALOG = [
  { slug: "pm-foundations", title: "Product Management Foundations", level: "beginner", audience: "Career switchers and new PMs", blurb: "The PM craft: discovery, roadmaps, delivery and stakeholders." },
  { slug: "vibe-coding", title: "Vibe Coding", level: "beginner", audience: "Non-engineers who want to build", blurb: "Build working prototypes with AI tools, no engineering background needed." },
  { slug: "ai-product-management", title: "AI Product Management", level: "intermediate", audience: "PMs moving into AI products", blurb: "Ship AI features end to end: discovery, model choice, evals and launch." },
  { slug: "claude-code-for-pms", title: "Claude Code for PMs", level: "intermediate", audience: "PMs who want to ship themselves", blurb: "Use Claude Code to prototype, ship and automate product work." },
  { slug: "codex-for-pms", title: "Codex for PMs", level: "intermediate", audience: "PMs who want to ship themselves", blurb: "Use Codex to turn specs into working software." },
  { slug: "product-analytics-experimentation", title: "Product Analytics & Experimentation", level: "intermediate", audience: "PMs who decide with data", blurb: "Metrics, funnels and A/B tests that hold up." },
  { slug: "go-to-market", title: "Go-to-Market", level: "intermediate", audience: "PMs and PMMs launching products", blurb: "Positioning, pricing and launch plans." },
  { slug: "ai-evals", title: "AI Evals", level: "advanced", audience: "PMs and engineers who own AI quality", blurb: "Measure and improve LLM output quality with evals." },
  { slug: "agentic-workflows-loops", title: "Agentic Workflows & Loops", level: "advanced", audience: "Builders automating work with agents", blurb: "Design agents and loops that run real workflows." },
  { slug: "forward-deployed-engineering", title: "Forward Deployed Engineering", level: "advanced", audience: "Technical PMs and engineers working with customers", blurb: "Deploy AI solutions inside customer teams." },
  { slug: "ai-product-strategy-leaders", title: "AI Product Strategy for Leaders", level: "advanced", audience: "Directors and VPs", blurb: "Set AI strategy, portfolio bets and the team operating model." },
  { slug: "product-leadership", title: "Product Leadership", level: "advanced", audience: "Managers of PMs", blurb: "Lead product teams, hire well and set direction." },
] as const;

export type Course = (typeof CATALOG)[number];
export type CourseSlug = Course["slug"];
export const COURSE_SLUGS = CATALOG.map((c) => c.slug) as unknown as [CourseSlug, ...CourseSlug[]];
export const courseBySlug = (slug: string) => CATALOG.find((c) => c.slug === slug);
