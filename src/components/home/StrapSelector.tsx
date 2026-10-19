"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { colorways } from "@/lib/art/palette";
import { assembledWatch, printPattern, sharedDefs, watchDefs } from "@/lib/art/svg";
import type { Product } from "@/types/catalog";
import { formatPrice, cx } from "@/lib/format";
import { variantAvailability } from "@/lib/commerce/availability";
import { useCart } from "@/components/commerce/CartProvider";
import { getCollection } from "@/data/collections";

const dials = [
  { id: "ivory", label: "Ivory dial", color: "#EDE9E0", dark: false },
  { id: "blue", label: "Blue dial", color: "#22324A", dark: true },
  { id: "black", label: "Black dial", color: "#161616", dark: true },
];

function preview(colorwayId: string, dialId: string) {
  const c = colorways[colorwayId];
  const d = dials.find((x) => x.id === dialId)!;
  const p = `sel${colorwayId}${dialId}`;
  return `<defs>${sharedDefs(p, { lite: true })}${watchDefs(p)}${printPattern(c, p + "print")}</defs>${assembledWatch({ c, p, dial: d.color, dialDark: d.dark, lite: true, hours: 10, minutes: 9, seconds: 36 })}`;
}

export function StrapSelector({ products }: { products: Product[] }) {
  const [idx, setIdx] = useState(0);
  const [dial, setDial] = useState("ivory");
  const [width, setWidth] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const { add } = useCart();
  const product = products[idx];
  const svg = useMemo(() => preview(product.colorway, dial), [product.colorway, dial]);
  const collection = getCollection(product.collection);

  function choose(i: number) {
    setIdx(i);
    setWidth(null);
    setMsg(null);
  }

  function addToBag() {
    if (!width) {
      setMsg("Choose your lug width before adding to bag.");
      return;
    }
    const r = add(width, 1);
    setMsg(r.ok ? r.message ?? null : r.message ?? "Unable to add this option.");
  }

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden bg-[radial-gradient(ellipse_at_40%_35%,#efe8dc,#d9cdb9)]">
        <div className="grain absolute inset-0" aria-hidden />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.svg
            key={product.colorway + dial}
            viewBox="-420 -640 840 1280"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label={`Illustration: an unbranded watch with a ${dials.find((d) => d.id === dial)!.label.toLowerCase()} on the ${product.name} strap.`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            dangerouslySetInnerHTML={{ __html: `<g transform="rotate(-8)">${svg}</g>` }}
          />
        </AnimatePresence>
      </div>

      <div>
        <p className="eyebrow text-gold-deep">Strap studio</p>
        <h2 className="serif mt-5 text-headline font-light">Try it on.</h2>
        <p className="mt-5 max-w-md leading-relaxed text-stone">Change the strap, change the watch. Choose a design and dial colour to see how each print sits beside polished steel.</p>

        <fieldset className="mt-10">
          <legend className="eyebrow text-stone">Strap</legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {products.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => choose(i)}
                aria-pressed={i === idx}
                aria-label={p.name}
                title={p.name}
                className={cx("relative h-11 w-11 rounded-full border transition-[transform,border-color] duration-500", i === idx ? "scale-110 border-ink" : "border-line-strong hover:scale-105")}
              >
                <span className="absolute inset-[4px] rounded-full" style={{ background: p.swatch }} />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="eyebrow text-[0.6rem] text-stone">{collection?.name} · {product.design}</p>
              <p className="serif mt-1 text-3xl">{product.name}</p>
            </div>
            <p className="text-sm tabular-nums">
              {formatPrice(product.price)}
              {!product.priceConfirmed && <span className="ml-2 text-[0.6rem] uppercase tracking-[0.16em] text-stone">Indicative</span>}
            </p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone">{product.shortDescription}</p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <fieldset>
            <legend className="eyebrow text-stone">Dial (preview only)</legend>
            <div className="mt-3 flex gap-2">
              {dials.map((d) => (
                <button key={d.id} type="button" onClick={() => setDial(d.id)} aria-pressed={dial === d.id} className={cx("min-h-10 border px-3 text-xs transition-colors", dial === d.id ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink")}>
                  {d.label.replace(" dial", "")}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="eyebrow text-stone">Lug width</legend>
            <div className="mt-3 flex gap-2">
              {product.variants.map((v) => {
                const a = variantAvailability(product, v);
                const off = a.max <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={off}
                    onClick={() => {
                      setWidth(v.id);
                      setMsg(null);
                    }}
                    aria-pressed={width === v.id}
                    title={off ? a.label : undefined}
                    className={cx("min-h-10 border px-3 text-xs tabular-nums transition-colors", width === v.id ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink", off && "cursor-not-allowed border-dashed text-stone/60 line-through decoration-stone/40 hover:border-line-strong")}
                  >
                    {v.lugWidthMm} mm<span className="sr-only">{off ? `, ${a.label}` : ""}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button type="button" onClick={addToBag} className="inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-indigo">
            Add to bag
          </button>
          <Link href={`/products/${product.handle}`} className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] link-underline-static">
            View details
          </Link>
          <Link href="/size-guide" className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-stone link-underline">
            Find your width
          </Link>
        </div>
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-stone">{msg}</p>
      </div>
    </div>
  );
}
