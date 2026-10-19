"use client";

import Link from "next/link";
import { Monogram } from "@/components/brand/Monogram";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-luxe flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <Monogram className="h-16 w-16 text-gold-deep" />
      <h1 className="serif mt-8 text-headline font-light">Something came loose.</h1>
      <p className="mt-5 max-w-md leading-relaxed text-stone">This page didn&rsquo;t load as it should. It may be a temporary network problem — please try again.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={reset} className="inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-indigo">Try again</button>
        <Link href="/" className="inline-flex min-h-12 items-center border border-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] hover:bg-ink hover:text-ivory">Home</Link>
      </div>
    </section>
  );
}
