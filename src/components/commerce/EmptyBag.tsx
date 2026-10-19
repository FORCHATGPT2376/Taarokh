import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";

export function EmptyBag({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <div className="relative mb-8 grid h-36 w-28 place-items-center border border-line-strong">
        <Monogram className="h-14 w-14 text-gold-deep" />
        <span className="absolute -bottom-px left-1/2 h-px w-10 -translate-x-1/2 bg-ivory" />
      </div>
      <p className="serif text-3xl">Your collection starts here.</p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">Your bag is empty. Explore the straps, or measure your lug width first.</p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <Link href="/shop" onClick={onNavigate} className="inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-indigo">
          Explore the collection
        </Link>
        <Link href="/size-guide" onClick={onNavigate} className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone link-underline hover:text-ink">
          Find your strap size
        </Link>
      </div>
    </div>
  );
}
