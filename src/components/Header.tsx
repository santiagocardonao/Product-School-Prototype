"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/advisor", label: "AI course advisor" },
  { href: "/teams", label: "For teams" },
  { href: "/checkout?plan=pro", label: "Checkout", match: "/checkout" },
];

export default function Header() {
  const path = usePathname();
  return (
    <>
      <div className="ps-annc ps-on-color" role="region" aria-label="Announcement">
        Prototype by Santiago Cardona · not affiliated with Product School
      </div>
      <nav aria-label="Main" className="ps-nav">
        <div className="px-[var(--section-pad-x)]"><div className="ps-container flex items-center gap-7 py-4">
          <Link href="/" className="flex items-center text-strong" aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ps-logo.svg" alt="Product School" className="h-[26px] w-auto" />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="ps-nav-link py-1.5" aria-current={path === (l.match ?? l.href) ? "page" : undefined}>{l.label}</Link>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/teams" className="ps-btn ps-btn-outline ps-btn-sm hidden sm:inline-flex">Get a team price</Link>
            <Link href="/advisor" className="ps-btn ps-btn-primary ps-btn-sm">Find my course</Link>
          </div>
        </div></div>
      </nav>
    </>
  );
}
