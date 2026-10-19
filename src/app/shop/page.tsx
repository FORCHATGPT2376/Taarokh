import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/editorial/PageHeader";
import { ShopGrid } from "@/components/product/ShopGrid";
import { publishedProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "The Strap Collection — Watch Straps for Analog Watches",
  description: "Heritage-inspired fabric watch straps for analog watches with standard lugs. Filter by collection, colour, lug width and material.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  const products = publishedProducts();
  return (
    <>
      <PageHeader
        crumbs={[{ href: "/shop", label: "Shop" }]}
        eyebrow={`${products.length} straps · catalogue preview`}
        title={["The Strap Collection"]}
        intro="A compact range of heritage-inspired straps for watches with compatible standard lugs. Measure your lug width before you choose."
      />
      <Suspense fallback={<div className="container-luxe h-[60vh]" aria-busy="true" />}>
        <ShopGrid products={products} />
      </Suspense>
    </>
  );
}
