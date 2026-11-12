// Outline-shield supergraphic (the isotipo at ~11% white), as in the DS hero.
export default function Shield({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="-0.1 0 21.9 26.5" className={`pointer-events-none absolute overflow-visible ${className}`}>
      <path fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="2" vectorEffect="non-scaling-stroke" fillRule="evenodd" d="M17 3.75C17 4.21 17.37 4.58 17.82 4.58H20.97C21.41 4.58 21.76 4.93 21.76 5.37V7.86L21.76 8.22C21.77 11.84 20.69 14.52 18.81 16.59C16.93 18.67 14.26 20.12 11.17 21.33V26.47L10.78 26.32C7.61 25.1 4.87 23.63 2.95 21.5C1.02 19.37 -0.08 16.59 0 12.79V5.37C0 4.93 0.36 4.58 0.79 4.58H4.05C4.5 4.58 4.870 4.21 4.87 3.75V0.79C4.87 0.35 5.23 0 5.66 0H16.21C16.64 0 17 0.35 17 0.79V3.75ZM5.16 12.85C5.11 14.69 5.53 16.28 6.46 17.62C7.34 18.87 8.69 19.92 10.6 20.72V16.03L10.78 15.96C12.89 15.14 14.36 14.04 15.3 12.7C16.24 11.37 16.65 9.77 16.61 7.93V5.69C16.61 5.23 16.23 4.86 15.78 4.86H5.99C5.53 4.86 5.16 5.23 5.16 5.69V12.85Z" />
    </svg>
  );
}
