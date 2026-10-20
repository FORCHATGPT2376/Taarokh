import { site, type StoreMode } from "@/data/site";
import type { Product, Variant } from "@/types/catalog";

export type Availability =
  | { kind: "purchasable"; max: number; label: string }
  | { kind: "preview"; max: number; label: string }
  | { kind: "unavailable"; max: 0; label: string };

/**
 * Single source of truth for what a shopper may do with a variant.
 * Used by the product page, the bag, and the server-side checkout route.
 */
export function variantAvailability(product: Product, v: Variant, mode: StoreMode = site.storeMode): Availability {
  if (product.status === "draft") return { kind: "unavailable", max: 0, label: "Not available" };
  if (v.status === "planned") return { kind: "unavailable", max: 0, label: "Planned width" };
  if (v.status === "unavailable") return { kind: "unavailable", max: 0, label: "Currently unavailable" };

  if (v.status === "live" && product.status === "live") {
    if (v.stock === null || v.stock <= 0) return { kind: "unavailable", max: 0, label: "Currently unavailable" };
    return { kind: "purchasable", max: Math.min(v.stock, site.maxPerOrder), label: "Available to order" };
  }

  // preview / sample pending
  if (mode === "preview") return { kind: "preview", max: site.maxPerOrder, label: "Available to order" };
  return { kind: "unavailable", max: 0, label: "Coming soon" };
}

export function productAvailabilityLabel(product: Product): string {
  const states = product.variants.map((v) => variantAvailability(product, v));
  if (states.some((s) => s.kind === "purchasable")) return "Available to order";
  if (states.some((s) => s.kind === "preview")) return "Available to order";
  return "Coming soon";
}

export const variantPrice = (p: Product, v: Variant) => v.price ?? p.price;
