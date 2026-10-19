"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types/catalog";
import { formatPrice, cx } from "@/lib/format";
import { imageMeta } from "@/lib/images";
import { productAvailabilityLabel, variantAvailability } from "@/lib/commerce/availability";
import { getCollection } from "@/data/collections";
import { useCart } from "@/components/commerce/CartProvider";

export function ProductCard({ product, priority, sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw", index = 0 }: { product: Product; priority?: boolean; sizes?: string; index?: number }) {
  const [a, b] = product.images;
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const selectable = product.variants.filter((v) => variantAvailability(product, v).max > 0);
  const quick = selectable.length === 1 ? selectable[0] : null;
  const widths = product.variants.filter((v) => v.status !== "unavailable");
  const collection = getCollection(product.collection);

  return (
    <article className="group relative">
      <Link href={`/products/${product.handle}`} className="block" aria-label={`${product.name}, ${collection?.name} collection`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-ivory-deep">
          <Image
            src={a.src}
            alt={a.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={imageMeta(a.src) ? "blur" : "empty"}
            blurDataURL={imageMeta(a.src)?.blur}
            className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
          />
          {b && (
            <Image
              src={b.src}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-luxe)] group-hover:opacity-100"
            />
          )}
          <span className="absolute left-3 top-3 bg-ivory/85 px-2 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur-[2px]">
            {productAvailabilityLabel(product)}
          </span>
          <span className="pointer-events-none absolute bottom-3 right-3 text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-ivory/80 mix-blend-difference">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </Link>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow text-[0.6rem] text-stone">{collection?.name} · {product.design}</p>
          <h3 className="serif mt-1.5 text-[1.65rem] leading-tight">
            <Link href={`/products/${product.handle}`} className="link-underline">
              {product.name}
            </Link>
          </h3>
          <p className="mt-2 text-xs text-stone">
            {widths.map((v, i) => (
              <span key={v.id} className={cx(v.status === "planned" && "text-stone/60")}>
                {i > 0 && " · "}
                {v.lugWidthMm} mm{v.status === "planned" && "*"}
              </span>
            ))}
            {widths.some((v) => v.status === "planned") && <span className="sr-only"> (* planned width)</span>}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm tabular-nums">{formatPrice(product.price)}</p>
          {!product.priceConfirmed && <p className="mt-0.5 text-[0.6rem] uppercase tracking-[0.16em] text-stone">Indicative</p>}
        </div>
      </div>
      {quick && (
        <button
          type="button"
          onClick={() => {
            const r = add(quick.id, 1);
            if (r.ok) {
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }
          }}
          className="mt-4 flex min-h-11 w-full items-center justify-between border-t border-line pt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-stone transition-colors hover:text-ink lg:opacity-0 lg:transition-opacity lg:duration-500 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
          aria-label={`Add ${product.name}, ${quick.lugWidthMm} millimetre, to bag`}
        >
          <span>{added ? "Added to bag" : `Add to bag · ${quick.lugWidthMm} mm`}</span>
          <span aria-hidden>{added ? "✓" : "+"}</span>
        </button>
      )}
    </article>
  );
}
