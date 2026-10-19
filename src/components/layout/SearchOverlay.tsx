"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { search } from "@/lib/search";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

const suggestions = ["Indigo", "20 mm", "Lug width", "Bagru", "Block printing"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const router = useRouter();
  useFocusTrap(ref, open, onClose);
  const results = useMemo(() => search(q).slice(0, 6), [q]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65]">
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative max-h-[100dvh] overflow-y-auto bg-ivory"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-luxe py-6 sm:py-10">
              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (q.trim()) {
                    onClose();
                    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                  }
                }}
                className="flex items-center gap-4 border-b border-ink pb-3"
              >
                <Search size={22} strokeWidth={1} aria-hidden />
                <label htmlFor="site-search" className="sr-only">
                  Search straps, journal and guides
                </label>
                <input
                  id="site-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search straps, stories, sizes…"
                  autoComplete="off"
                  className="serif min-w-0 flex-1 bg-transparent text-2xl outline-none placeholder:text-stone/60 sm:text-4xl"
                />
                <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center" aria-label="Close search">
                  <X size={20} strokeWidth={1} />
                </button>
              </form>
              <div className="py-6" aria-live="polite">
                {!q && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow mr-2 text-stone">Try</span>
                    {suggestions.map((s) => (
                      <button key={s} type="button" onClick={() => setQ(s)} className="border border-line-strong px-3 py-2 text-xs transition-colors hover:bg-ink hover:text-ivory">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {q && results.length === 0 && (
                  <p className="text-sm text-stone">
                    Nothing matches “{q}”. Try a colour, a collection, or <Link href="/size-guide" onClick={onClose} className="underline underline-offset-4">“lug width”</Link>.
                  </p>
                )}
                {results.length > 0 && (
                  <ul className="divide-y divide-line">
                    {results.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} onClick={onClose} className="group flex items-baseline justify-between gap-6 py-4">
                          <span className="serif text-xl transition-colors group-hover:text-indigo sm:text-2xl">{r.title}</span>
                          <span className="eyebrow shrink-0 text-stone">{r.type}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
