"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, ShoppingBag } from "lucide-react";
import { nav, site } from "@/data/site";
import { cx } from "@/lib/format";
import { Wordmark } from "@/components/brand/Wordmark";
import { useCart } from "@/components/commerce/CartProvider";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";

/** Pages whose first section is a full-bleed dark image. */
const overlayRoutes = ["/"];

export function Header() {
  const pathname = usePathname();
  const overlay = overlayRoutes.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { count, open, ready } = useCart();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close overlays when the route changes (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(false);
    setSearch(false);
  }

  const transparent = overlay && !scrolled && !menu;
  const preview = site.storeMode === "preview";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {preview && (
          <div className={cx("flex h-8 items-center justify-center px-4 text-center transition-colors duration-700", transparent ? "bg-ink/30 text-ivory/85" : "bg-indigo text-ivory/90")}>
            <p className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.24em]">
              Catalogue preview<span className="hidden sm:inline"> · orders are not yet open</span> ·{" "}
              <Link href="/#newsletter" className="link-underline-static">
                Get the launch update
              </Link>
            </p>
          </div>
        )}
        <div
          className={cx(
            "relative transition-[background-color,color,border-color,backdrop-filter] duration-700 ease-[var(--ease-luxe)]",
            transparent ? "border-b border-transparent bg-transparent text-ivory" : "border-b border-line bg-ivory/92 text-ink backdrop-blur-md",
          )}
        >
          <div className="container-luxe flex h-[4.5rem] items-center justify-between gap-6">
            <div className="flex flex-1 items-center lg:hidden">
              <button type="button" className="-ml-2 grid h-11 w-11 place-items-center" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu} aria-controls="mobile-menu">
                <span className="flex w-6 flex-col gap-[6px]" aria-hidden>
                  <span className="h-px w-6 bg-current" />
                  <span className="h-px w-4 bg-current" />
                </span>
              </button>
            </div>

            <Link href="/" className="shrink-0" aria-label="TAAROKH Jaipur — home">
              <Wordmark subtle />
            </Link>

            <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
              <ul className="flex items-center gap-9">
                {nav.map((n) => {
                  const active = pathname === n.href || pathname.startsWith(n.href + "/");
                  return (
                    <li key={n.href}>
                      <Link href={n.href} aria-current={active ? "page" : undefined} className="group relative py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
                        {n.label}
                        <span className={cx("absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-luxe)]", active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100")} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none">
              <button type="button" onClick={() => setSearch(true)} className="grid h-11 w-11 place-items-center" aria-label="Search">
                <Search size={18} strokeWidth={1.1} />
              </button>
              <button type="button" onClick={open} className="relative grid h-11 w-11 place-items-center" aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}>
                <ShoppingBag size={18} strokeWidth={1.1} />
                {ready && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cx("absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.55rem] font-bold tabular-nums", transparent ? "bg-ivory text-ink" : "bg-ink text-ivory")}
                  >
                    {count}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {!overlay && <div aria-hidden style={{ height: preview ? "calc(2rem + 4.5rem)" : "4.5rem" }} />}
      <MobileMenu open={menu} onClose={() => setMenu(false)} onSearch={() => { setMenu(false); setSearch(true); }} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
