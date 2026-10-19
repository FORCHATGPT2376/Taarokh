import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Monogram className="h-16 w-16 text-gold-deep" />
      <p className="eyebrow mt-10 text-stone">Error 404</p>
      <h1 className="serif mt-5 text-headline font-light">This page has slipped its strap.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-stone">We couldn&rsquo;t find that page. Return to the collection or check your strap size.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-indigo">The collection</Link>
        <Link href="/size-guide" className="inline-flex min-h-12 items-center border border-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] hover:bg-ink hover:text-ivory">Size guide</Link>
      </div>
    </section>
  );
}
