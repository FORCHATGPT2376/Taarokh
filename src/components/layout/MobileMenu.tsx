"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { useRef } from "react";
import { nav, site } from "@/data/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { Monogram } from "@/components/brand/Monogram";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  const items = [...nav, { href: "/size-guide", label: "Size Guide" }];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="dark-surface fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-indigo-deep text-ivory lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="container-luxe flex h-[4.5rem] shrink-0 items-center justify-between">
            <button type="button" onClick={onClose} className="-ml-2 grid h-11 w-11 place-items-center" aria-label="Close menu">
              <X size={22} strokeWidth={1} />
            </button>
            <Link href="/" onClick={onClose} aria-label="TAAROKH Jaipur — home">
              <Wordmark subtle />
            </Link>
            <button type="button" onClick={onSearch} className="-mr-2 grid h-11 w-11 place-items-center" aria-label="Search">
              <Search size={18} strokeWidth={1.1} />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-luxe flex flex-1 flex-col justify-center py-10">
            <ol className="space-y-1">
              {items.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.25 + i * 0.06 }}>
                    <Link href={n.href} onClick={onClose} className="group flex items-baseline gap-5 py-2">
                      <span className="w-6 text-[0.6rem] font-semibold tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                      <span className="serif text-[clamp(2.4rem,11vw,3.6rem)] leading-[1.05] transition-[letter-spacing,color] duration-500 group-hover:text-sand">{n.label}</span>
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ol>
          </nav>
          <motion.div className="container-luxe flex items-end justify-between gap-6 border-t border-line-dark py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            <div className="space-y-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory/70">
              <Link href="/contact" onClick={onClose} className="block link-underline">Contact</Link>
              <Link href="/faq" onClick={onClose} className="block link-underline">FAQ</Link>
              {site.social.instagram && (
                <a href={site.social.instagram} className="block link-underline" target="_blank" rel="noopener noreferrer">Instagram</a>
              )}
            </div>
            <Monogram className="h-12 w-12 text-gold" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
