import Link from "next/link";
export default function Header() {
  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs text-surface">
        Prototype by Santiago Cardona for the Product Builder role. Not affiliated with Product School. Team discounts are placeholders.
      </div>
      <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
        <Link href="/" className="font-display text-lg font-bold">Product School <span className="font-normal text-muted">· lead capture prototype</span></Link>
        <nav className="flex gap-5 text-sm">
          <Link href="/advisor" className="hover:text-primary">AI course advisor</Link>
          <Link href="/teams" className="hover:text-primary">Team pricing</Link>
          <Link href="/checkout?plan=pro" className="hover:text-primary">Checkout</Link>
        </nav>
      </header>
    </>
  );
}
