"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/catalog";
import { variantAvailability, variantPrice } from "@/lib/commerce/availability";
import { formatPrice, cx } from "@/lib/format";
import { useCart } from "@/components/commerce/CartProvider";
import { QuantityControl } from "@/components/commerce/QuantityControl";
import { site } from "@/data/site";

export function ProductPurchase({ product, siblings }: { product: Product; siblings: Pick<Product, "handle" | "name" | "swatch" | "color">[] }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<{ kind: "error" | "ok"; text: string } | null>(null);
  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const avail = variant ? variantAvailability(product, variant) : null;
  const anyAvailable = product.variants.some((v) => variantAvailability(product, v).max > 0);
  const price = variant ? variantPrice(product, variant) : product.price;
  const lengths = [...new Set(product.variants.map((v) => `${v.lengthLabel} — ${v.longPieceMm} / ${v.shortPieceMm} mm`))];

  function submit() {
    if (!variant) {
      setMsg({ kind: "error", text: "Choose your lug width before adding to bag." });
      return;
    }
    const r = add(variant.id, qty);
    setMsg(r.ok ? { kind: "ok", text: r.message ?? "Added to your bag." } : { kind: "error", text: r.message ?? "This option is not available." });
  }

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <p className="serif text-3xl tabular-nums">{formatPrice(price)}</p>
        {!product.priceConfirmed && <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-stone">Indicative price</p>}
      </div>
      <p className="mt-1 text-xs text-stone">{product.priceConfirmed ? "Tax treatment shown at checkout." : "Proposed price — will be confirmed before orders open."}</p>

      {siblings.length > 1 && (
        <fieldset className="mt-9">
          <legend className="eyebrow text-[0.62rem] text-stone">Colour — <span className="text-ink">{product.color}</span></legend>
          <div className="mt-3 flex gap-3">
            {siblings.map((s) => (
              <Link key={s.handle} href={`/products/${s.handle}`} aria-label={`${s.name} (${s.color})`} aria-current={s.handle === product.handle ? "true" : undefined} title={s.name} className={cx("relative h-10 w-10 rounded-full border transition-transform duration-500", s.handle === product.handle ? "border-ink" : "border-line-strong hover:scale-105")}>
                <span className="absolute inset-[4px] rounded-full" style={{ background: s.swatch }} />
              </Link>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-8">
        <div className="flex items-baseline justify-between">
          <legend className="eyebrow text-[0.62rem] text-stone">Lug width{variant && <> — <span className="text-ink">{variant.lugWidthMm} mm</span></>}</legend>
          <Link href="/size-guide" className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] link-underline-static">How to find your strap size</Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Lug width">
          {product.variants.map((v) => {
            const a = variantAvailability(product, v);
            const off = a.max <= 0;
            const on = variantId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-disabled={off}
                onClick={() => {
                  if (off) {
                    setMsg({ kind: "error", text: `${v.lugWidthMm} mm is a ${a.label.toLowerCase()}. Contact us if you need this width.` });
                    return;
                  }
                  setVariantId(v.id);
                  setQty(1);
                  setMsg(null);
                }}
                className={cx("flex min-h-14 flex-col items-center justify-center border text-sm tabular-nums transition-colors duration-300", on ? "border-ink bg-ink text-ivory" : "border-line-strong hover:border-ink", off && "cursor-not-allowed border-dashed text-stone/70 hover:border-line-strong")}
              >
                {v.lugWidthMm} mm
                <span className={cx("mt-0.5 text-[0.55rem] uppercase tracking-[0.14em]", on ? "text-ivory/70" : "text-stone")}>{off ? a.label : `buckle ${v.buckleWidthMm} mm`}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <p className="eyebrow text-[0.62rem] text-stone">Length</p>
        <p className="mt-2 border border-line px-4 py-3 text-sm">{lengths[0]} <span className="text-stone">(target)</span></p>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <p className="eyebrow mb-2 text-[0.62rem] text-stone">Quantity</p>
          <QuantityControl value={qty} max={avail?.max || site.maxPerOrder} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
        </div>
        <button type="button" onClick={submit} disabled={!anyAvailable} className="min-h-12 flex-1 bg-ink px-6 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-indigo disabled:opacity-40">
          {anyAvailable ? (site.storeMode === "preview" ? "Add to preview bag" : "Add to bag") : "Currently unavailable"}
        </button>
      </div>
      <p aria-live="polite" className={cx("mt-3 min-h-5 text-sm", msg?.kind === "error" ? "text-error" : "text-stone")}>{msg?.text}</p>

      <div className="mt-4 space-y-2 border-t border-line pt-5 text-xs leading-relaxed text-stone">
        <p>
          <span className="font-semibold text-ink">{avail?.label ?? (anyAvailable ? (site.storeMode === "preview" ? "Concept preview" : "Available to order") : "Coming soon")}.</span>{" "}
          {site.storeMode === "preview" ? "Orders are not open yet. Sample straps are being developed and tested; nothing can be purchased during the preview." : null}
        </p>
        <p>Measure your watch&rsquo;s lug width before ordering. Compatibility depends on the case and attachment system; <Link href="/contact" className="underline underline-offset-2">contact us</Link> if unsure.</p>
      </div>
    </div>
  );
}
