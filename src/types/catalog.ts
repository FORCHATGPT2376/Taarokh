export type ProductStatus = "draft" | "preview" | "live";

/**
 * Variant availability:
 * - "live":    a tested, QC-released physical SKU. Purchasable when stock > 0.
 * - "preview": concept / sample pending. Can sit in a preview bag; never checked out.
 * - "planned": a width under consideration. Shown, but cannot be selected.
 * - "unavailable": discontinued or sold out.
 */
export type VariantStatus = "live" | "preview" | "planned" | "unavailable";

export interface Variant {
  id: string;
  sku: string;
  lugWidthMm: number;
  buckleWidthMm: number;
  /** e.g. "Standard" */
  lengthLabel: string;
  longPieceMm: number;
  shortPieceMm: number;
  status: VariantStatus;
  /** null = not configured. Never invent stock. */
  stock: number | null;
  /** Optional price override for this variant (INR, whole rupees). */
  price?: number;
  /** Shopify variant GID, when the Shopify provider is used. */
  shopifyVariantId?: string;
}

/** A specification value plus whether it has been verified on a physical sample. */
export interface Spec {
  label: string;
  value: string;
  verified: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
  /** e.g. "Concept render". Shown on the image when set. */
  note?: string;
}

export interface Product {
  id: string;
  handle: string;
  name: string;
  /** Design / print name, e.g. "Indigo Buti" */
  design: string;
  collection: string; // collection handle
  status: ProductStatus;
  featured: boolean;
  /** INR, whole rupees */
  price: number;
  /** false = hypothesis price, labelled "Indicative" on the site */
  priceConfirmed: boolean;
  currency: "INR";
  color: string; // colour family used for filtering
  swatch: string; // hex for UI swatch
  colorway: string; // art colourway id (src/lib/art/palette.ts)
  material: string; // material family used for filtering
  shortDescription: string;
  description: string[];
  inspiration: string;
  /** Exactly what is verified about origin/printing/assembly. */
  provenance: string;
  images: ProductImage[];
  specs: Spec[];
  construction: string[];
  buckle: string;
  care: string[];
  variants: Variant[];
  related?: string[];
  seo: { title: string; description: string };
  createdAt: string;
}

export interface Collection {
  handle: string;
  name: string;
  number: string;
  tagline: string;
  description: string[];
  image: string;
  imageAlt: string;
  tone: "light" | "dark";
}
