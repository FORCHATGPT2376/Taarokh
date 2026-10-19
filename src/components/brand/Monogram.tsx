/** Cusped-arch monogram (also the favicon). Decorative. */
export function Monogram({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none" stroke="currentColor">
      <path
        d="M12 60 V30 C12 25 15 22.5 18 23 C17.8 18.6 21 15.6 24.4 16.2 C24.6 11.6 28.4 8 32 3.5 C35.6 8 39.4 11.6 39.6 16.2 C43 15.6 46.2 18.6 46 23 C49 22.5 52 25 52 30 V60"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M23 31 H41 M32 31 V52" strokeWidth="2" strokeLinecap="square" />
      <path d="M28.5 52 H35.5" strokeWidth="1.4" />
    </svg>
  );
}
