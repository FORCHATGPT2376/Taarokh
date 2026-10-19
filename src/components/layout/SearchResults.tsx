"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { search } from "@/lib/search";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? "";
  const [value, setValue] = useState(q);
  const results = search(q);
  return (
    <section className="container-luxe pb-32">
      <form role="search" onSubmit={(e) => { e.preventDefault(); router.replace(`/search?q=${encodeURIComponent(value.trim())}`); }} className="flex items-end gap-4 border-b border-ink">
        <label htmlFor="search-page" className="sr-only">Search</label>
        <input id="search-page" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search straps, stories, sizes…" className="serif min-w-0 flex-1 bg-transparent py-3 text-3xl outline-none placeholder:text-stone/50" />
        <button type="submit" className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em]">Search</button>
      </form>
      <p className="mt-6 text-sm text-stone" aria-live="polite">{q ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${q}”` : "Type to search the collection, journal and guides."}</p>
      {q && results.length === 0 && (
        <div className="py-20 text-center">
          <p className="serif text-4xl">Nothing found.</p>
          <p className="mt-3 text-sm text-stone">Try a colour (“indigo”), a collection (“Bagru”) or “lug width”.</p>
        </div>
      )}
      <ul className="mt-8 divide-y divide-line">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="group flex items-center gap-6 py-5">
              {r.image && <span className="relative block h-20 w-16 shrink-0 overflow-hidden bg-ivory-deep"><Image src={r.image} alt="" fill sizes="64px" className="object-cover" /></span>}
              <span className="min-w-0 flex-1">
                <span className="eyebrow block text-[0.6rem] text-stone">{r.type}</span>
                <span className="serif mt-1 block text-2xl transition-colors group-hover:text-indigo">{r.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
