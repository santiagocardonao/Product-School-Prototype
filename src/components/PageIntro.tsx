export default function PageIntro({ eyebrow, title, accent, lede }: { eyebrow: string; title: string; accent: string; lede?: string }) {
  return (
    <div className="max-w-3xl">
      <span className="ps-eyebrow">{eyebrow}</span>
      <h1 className="ps-h1-page mt-5">{title} <span className="ps-accent">{accent}</span></h1>
      {lede && <p className="ps-lede mt-5 max-w-2xl">{lede}</p>}
    </div>
  );
}
