export default function Footer() {
  return (
    <footer className="ps-footer ps-on-color">
      <div className="px-[var(--section-pad-x)]"><div className="ps-container flex flex-col gap-6 py-14 pb-20 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ps-logo.svg" alt="" className="h-6 w-auto invert" />
          <p className="mt-4 text-sm font-light leading-relaxed">
            A thin working prototype: three ways to capture leads while pricing stays public. Built by Santiago Cardona for the Product Builder (Growth &amp; Website) role.
          </p>
        </div>
        <ul className="space-y-1 font-mono text-xs uppercase tracking-wide text-[var(--neutral-200)]">
          <li>Content · src/data (Contentful stand-in)</li>
          <li>Events · track() (Segment stand-in)</li>
          <li>Leads · /api/lead (HubSpot stand-in)</li>
          <li>AI · real Claude call, Zod-validated</li>
        </ul>
      </div></div>
    </footer>
  );
}
