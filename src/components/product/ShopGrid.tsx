"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { Product } from "@/types/catalog";
import { collections } from "@/data/collections";
import { variantAvailability } from "@/lib/commerce/availability";
import { cx } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import { useFocusTrap } from "@/components/ui/useFocusTrap";

type Key = "collection" | "color" | "width" | "material" | "availability";
type Opt = { value: string; label: string; swatch?: string };

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "newest", label: "Newest" },
];

function availabilityOf(p: Product): "available" | "preview" | "soon" {
  const k = p.variants.map((v) => variantAvailability(p, v).kind);
  if (k.includes("purchasable")) return "available";
  if (k.includes("preview")) return "preview";
  return "soon";
}

export function ShopGrid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  useFocusTrap(sheetRef, sheet, () => setSheet(false));

  const groups = useMemo((): { key: Key; label: string; options: Opt[] }[] => {
    const uniq = (xs: string[]) => [...new Set(xs)];
    const widths = uniq(products.flatMap((p) => p.variants.filter((v) => v.status !== "planned" && v.status !== "unavailable").map((v) => String(v.lugWidthMm)))).sort();
    return [
      { key: "collection" as Key, label: "Collection", options: collections.map((c) => ({ value: c.handle, label: c.name })) },
      { key: "color" as Key, label: "Colour", options: uniq(products.map((p) => p.color)).map((c) => ({ value: c.toLowerCase(), label: c, swatch: products.find((p) => p.color === c)?.swatch })) },
      { key: "width" as Key, label: "Lug width", options: widths.map((w) => ({ value: w, label: `${w} mm` })) },
      { key: "material" as Key, label: "Material", options: uniq(products.map((p) => p.material)).map((m) => ({ value: m.toLowerCase().replace(/[^a-z]+/g, "-"), label: m })) },
      {
        key: "availability" as Key,
        label: "Availability",
        options: [
          { value: "available", label: "Available to order" },
          { value: "preview", label: "Concept preview" },
        ],
      },
    ];
  }, [products]);

  const selected = (k: Key) => (params.get(k) ?? "").split(",").filter(Boolean);
  const sort = params.get("sort") ?? "featured";

  function update(k: string, values: string[] | string | null) {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(values) ? values.join(",") : values;
    if (v) next.set(k, v);
    else next.delete(k);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }
  const toggle = (k: Key, v: string) => {
    const cur = selected(k);
    update(k, cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
  };

  const filtered = useMemo(() => {
    const f = (k: Key) => (params.get(k) ?? "").split(",").filter(Boolean);
    let list = products.filter((p) => {
      const c = f("collection"), col = f("color"), w = f("width"), m = f("material"), a = f("availability");
      if (c.length && !c.includes(p.collection)) return false;
      if (col.length && !col.includes(p.color.toLowerCase())) return false;
      if (w.length && !p.variants.some((v) => w.includes(String(v.lugWidthMm)) && variantAvailability(p, v).max > 0)) return false;
      if (m.length && !m.includes(p.material.toLowerCase().replace(/[^a-z]+/g, "-"))) return false;
      if (a.length && !a.includes(availabilityOf(p))) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((x, y) => x.price - y.price);
    if (sort === "price-desc") list = [...list].sort((x, y) => y.price - x.price);
    if (sort === "newest") list = [...list].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
    if (sort === "featured") list = [...list].sort((x, y) => Number(y.featured) - Number(x.featured));
    return list;
  }, [products, params, sort]);

  const activeCount = groups.reduce((n, g) => n + selected(g.key).length, 0);
  const clearAll = () => router.replace(sort !== "featured" ? `${pathname}?sort=${sort}` : pathname, { scroll: false });

  const filterControls = (layout: "bar" | "sheet") =>
    groups.map((g) => (
      <fieldset key={g.key} className={layout === "sheet" ? "border-b border-line py-6" : ""}>
        <legend className="eyebrow text-[0.6rem] text-stone">{g.label}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {g.options.map((o) => {
            const on = selected(g.key).includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(g.key, o.value)}
                className={cx("inline-flex min-h-9 items-center gap-2 border px-3 text-xs transition-colors duration-300", on ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}
              >
                {o.swatch && <span className="h-3 w-3 rounded-full ring-1 ring-ink/15" style={{ background: o.swatch }} aria-hidden />}
                {o.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    ));

  return (
    <section className="container-luxe pb-32" aria-label="Products">
      <div className="sticky top-[calc(var(--header-offset,6.5rem))] z-20 -mx-[var(--gutter)] flex items-center justify-between gap-4 border-y border-line bg-ivory/95 px-[var(--gutter)] py-3 backdrop-blur">
        <button type="button" onClick={() => setSheet(true)} className="flex min-h-11 items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em]" aria-haspopup="dialog">
          <SlidersHorizontal size={15} strokeWidth={1.2} />
          Filter{activeCount > 0 && <span className="tabular-nums text-stone">({activeCount})</span>}
        </button>
        <p className="hidden text-xs text-stone sm:block" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "strap" : "straps"}
        </p>
        <label className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
          <span className="hidden sm:inline">Sort</span>
          <select value={sort} onChange={(e) => update("sort", e.target.value === "featured" ? null : e.target.value)} className="min-h-11 cursor-pointer appearance-none bg-transparent pr-5 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] outline-none" style={{ backgroundImage: "linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%)", backgroundPosition: "right 6px center, right 2px center", backgroundSize: "4px 4px", backgroundRepeat: "no-repeat" }}>
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {activeCount > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {groups.flatMap((g) =>
            selected(g.key).map((v) => (
              <button key={g.key + v} type="button" onClick={() => toggle(g.key, v)} className="inline-flex min-h-8 items-center gap-2 bg-ink/5 px-3 text-xs hover:bg-ink/10">
                {g.options.find((o) => o.value === v)?.label ?? v}
                <X size={12} aria-label="Remove filter" />
              </button>
            )),
          )}
          <button type="button" onClick={clearAll} className="ml-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-stone link-underline-static">
            Clear all
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="mx-auto max-w-md py-32 text-center">
          <p className="serif text-4xl">No straps match these filters.</p>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Try another width or colour — or <Link href="/contact" className="underline underline-offset-4">ask us about future sizes</Link>. No strap is open for order yet during the catalogue preview.
          </p>
          <button type="button" onClick={clearAll} className="mt-8 inline-flex min-h-12 items-center border border-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] hover:bg-ink hover:text-ivory">
            Clear filters
          </button>
        </div>
      ) : (
        <motion.ul layout className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.li key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <ProductCard product={p} index={i} priority={i < 3} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <p className="mt-24 max-w-2xl text-xs leading-relaxed text-stone">
        * Planned widths are under consideration and not yet selectable. Lug width alone does not guarantee fit — compatibility depends on your case and attachment system. <Link href="/size-guide" className="underline underline-offset-2">How to find your strap size</Link>.
      </p>

      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[70]">
            <motion.div className="absolute inset-0 bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} aria-hidden />
            <motion.div
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-ivory"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <p className="serif text-2xl">Refine</p>
                <button type="button" onClick={() => setSheet(false)} className="grid h-11 w-11 place-items-center" aria-label="Close filters">
                  <X size={20} strokeWidth={1} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6">{filterControls("sheet")}</div>
              <div className="flex gap-3 border-t border-line p-6">
                <button type="button" onClick={clearAll} className="min-h-12 flex-1 border border-line-strong text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
                  Clear
                </button>
                <button type="button" onClick={() => setSheet(false)} className="min-h-12 flex-[2] bg-ink text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory">
                  Show {filtered.length} {filtered.length === 1 ? "strap" : "straps"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
