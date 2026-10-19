"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { imageMeta } from "@/lib/images";
import { useCart } from "./CartProvider";
import { QuantityControl } from "./QuantityControl";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyBag } from "./EmptyBag";

/** Shared by the drawer and the /cart page. */
export function BagContents({ onNavigate, variant = "drawer" }: { onNavigate?: () => void; variant?: "drawer" | "page" }) {
  const { lines, subtotal, setQuantity, remove, notice, ready } = useCart();
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "error"; message?: string }>({ kind: "idle" });
  const preview = site.storeMode === "preview" || lines.some((l) => l.availabilityKind !== "purchasable");

  async function checkout() {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })) }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        window.location.assign(data.url);
        return;
      }
      setStatus({ kind: "error", message: data?.message ?? "Checkout is not available right now. Nothing has been charged." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the checkout. Please check your connection and try again. Nothing has been charged." });
    }
  }

  if (!ready) {
    return (
      <div className="flex-1 space-y-6 p-6" aria-busy="true">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-24 w-20 animate-pulse bg-ink/5" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-3 w-2/3 animate-pulse bg-ink/5" />
              <div className="h-3 w-1/3 animate-pulse bg-ink/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (lines.length === 0) return <EmptyBag onNavigate={onNavigate} />;

  return (
    <div className={variant === "drawer" ? "flex min-h-0 flex-1 flex-col" : "grid gap-12 lg:grid-cols-[1fr_24rem]"}>
      <div className={variant === "drawer" ? "min-h-0 flex-1 overflow-y-auto px-6 sm:px-8" : ""}>
        {notice && <p className="mb-4 border-l border-gold-deep py-1 pl-3 text-sm text-stone">{notice}</p>}
        <ul className="divide-y divide-line">
          {lines.map((l) => {
            const img = l.product.images[1] ?? l.product.images[0];
            return (
              <li key={l.variantId} className="flex gap-5 py-6">
                <Link href={`/products/${l.product.handle}`} onClick={onNavigate} className="relative block aspect-[4/5] w-20 shrink-0 overflow-hidden bg-ivory-deep sm:w-24">
                  <Image src={img.src} alt={img.alt} fill sizes="96px" className="object-cover" placeholder={imageMeta(img.src) ? "blur" : "empty"} blurDataURL={imageMeta(img.src)?.blur} />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/products/${l.product.handle}`} onClick={onNavigate} className="serif text-xl leading-tight link-underline">
                        {l.product.name}
                      </Link>
                      <p className="mt-1 text-xs text-stone">
                        {l.variant.lugWidthMm} mm lug · {l.variant.lengthLabel} length
                      </p>
                      <p className="mt-0.5 text-[0.7rem] text-stone/90">SKU {l.variant.sku}</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums">{formatPrice(l.unitPrice * l.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                    <QuantityControl size="sm" value={l.quantity} max={l.max} onChange={(n) => setQuantity(l.variantId, n)} label={l.product.name} />
                    <button type="button" onClick={() => remove(l.variantId)} className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone link-underline hover:text-ink">
                      Remove<span className="sr-only"> {l.product.name}</span>
                    </button>
                  </div>
                  {l.quantity >= l.max && <p className="mt-2 text-[0.7rem] text-stone">Maximum of {l.max} per order.</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={variant === "drawer" ? "border-t border-line bg-paper px-6 pb-6 pt-5 sm:px-8" : "h-fit border border-line bg-paper p-8"}>
        <dl className="flex items-baseline justify-between">
          <dt className="eyebrow">Subtotal</dt>
          <dd className="serif text-2xl tabular-nums">{formatPrice(subtotal)}</dd>
        </dl>
        <p className="mt-2 text-xs leading-relaxed text-stone">
          Shipping and any applicable taxes are calculated at checkout. Please confirm your selected strap width before checking out.
        </p>
        {preview ? (
          <div className="mt-5 border border-line-strong p-4">
            <p className="eyebrow text-gold-deep">Preview mode</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Orders are not open yet. Your bag is saved on this device so you can return to it — no order will be placed and nothing will be charged.
            </p>
            <ButtonLink href="/#newsletter" onClick={onNavigate} variant="solid" className="mt-4 w-full">
              Get the launch update
            </ButtonLink>
          </div>
        ) : (
          <Button onClick={checkout} disabled={status.kind === "loading"} className="mt-5 w-full" arrow>
            {status.kind === "loading" ? "Preparing secure checkout…" : "Secure checkout"}
          </Button>
        )}
        {status.kind === "error" && (
          <p role="alert" className="mt-3 text-sm text-error">
            {status.message}
          </p>
        )}
        <div className="mt-4 flex justify-center">
          {variant === "drawer" ? (
            <button type="button" onClick={onNavigate} className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone link-underline hover:text-ink">
              Continue shopping
            </button>
          ) : (
            <Link href="/shop" className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone link-underline hover:text-ink">
              Continue shopping
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
