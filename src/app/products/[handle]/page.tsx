import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";
import { getProduct, products, productsInCollection } from "@/data/products";
import { getCollection } from "@/data/collections";
import { reviewsFor } from "@/data/reviews";
import { site } from "@/data/site";
import { Breadcrumbs } from "@/components/editorial/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Reveal";
import { TBC } from "@/components/editorial/DraftNotice";
import { variantAvailability } from "@/lib/commerce/availability";

export function generateStaticParams() {
  return products.filter((p) => p.status !== "draft").map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return { title: "Strap not found" };
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/products/${p.handle}` },
    openGraph: { title: `${p.seo.title} | TAAROKH`, description: p.seo.description, images: [{ url: p.images[0].src, alt: p.images[0].alt }] },
  };
}

export default function ProductPage({ params }: PageProps<"/products/[handle]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: PageProps<"/products/[handle]">["params"] }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product || product.status === "draft") notFound();
  const collection = getCollection(product.collection)!;
  const siblings = productsInCollection(product.collection).map(({ handle, name, swatch, color }) => ({ handle, name, swatch, color }));
  const related = (product.related ?? []).map(getProduct).filter((p): p is NonNullable<typeof p> => !!p && p.status !== "draft").slice(0, 3);
  const reviews = reviewsFor(product.handle);
  const live = product.variants.filter((v) => variantAvailability(product, v).kind === "purchasable");
  const v0 = product.variants.find((v) => v.status !== "planned") ?? product.variants[0];

  // Product structured data only for genuinely purchasable products (no fabricated offers or ratings).
  const ld =
    product.status === "live" && live.length > 0 && product.priceConfirmed
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.shortDescription,
          image: product.images.map((i) => `${site.url}${i.src}`),
          brand: { "@type": "Brand", name: "TAAROKH" },
          sku: live[0].sku,
          offers: live.map((v) => ({ "@type": "Offer", sku: v.sku, price: v.price ?? product.price, priceCurrency: "INR", availability: "https://schema.org/InStock", url: `${site.url}/products/${product.handle}` })),
        }
      : null;

  return (
    <>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
      <div className="container-luxe pt-8 sm:pt-12">
        <Breadcrumbs items={[{ href: "/shop", label: "Shop" }, { href: `/collections/${collection.handle}`, label: collection.name }, { href: `/products/${product.handle}`, label: product.name }]} />
      </div>

      <section className="container-luxe mt-8 grid gap-12 pb-24 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-offset)+2rem)]">
            <p className="eyebrow text-gold-deep">
              <Link href={`/collections/${collection.handle}`} className="link-underline">{collection.name} collection</Link> · {product.design}
            </p>
            <h1 className="serif mt-4 text-[clamp(2.6rem,1.8rem+2.6vw,4rem)] font-light leading-[1.02]">{product.name}</h1>
            <p className="mt-5 max-w-md leading-relaxed text-stone">{product.shortDescription}</p>
            <div className="mt-8">
              <ProductPurchase product={product} siblings={siblings} />
            </div>
            <div className="mt-10">
              <Accordion
                items={[
                  {
                    title: "Description",
                    content: (
                      <div className="space-y-3">
                        {product.description.map((d) => <p key={d}>{d}</p>)}
                        <p className="text-stone"><span className="font-semibold text-ink">Inspiration. </span>{product.inspiration}</p>
                        <p className="border-l border-gold-deep pl-3 text-stone"><span className="font-semibold text-ink">Provenance. </span>{product.provenance}</p>
                      </div>
                    ),
                  },
                  {
                    title: "Dimensions",
                    content: (
                      <dl className="divide-y divide-line">
                        {[
                          ["Lug width", product.variants.map((v) => `${v.lugWidthMm} mm${v.status === "planned" ? " (planned)" : ""}`).join(" · ")],
                          ["Buckle width", `${v0.buckleWidthMm} mm (taper)`],
                          ["Long piece", `≈ ${v0.longPieceMm} mm`],
                          ["Buckle piece", `≈ ${v0.shortPieceMm} mm`],
                          ["Thickness", null],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-6 py-2.5">
                            <dt className="text-stone">{k}</dt>
                            <dd className="text-right"><TBC value={v} /></dd>
                          </div>
                        ))}
                        <p className="pt-3 text-xs text-stone">Target dimensions from the sample specification — confirmed on the finished strap before release.</p>
                      </dl>
                    ),
                  },
                  {
                    title: "Materials & construction",
                    content: (
                      <div>
                        <dl className="divide-y divide-line">
                          {product.specs.map((s) => (
                            <div key={s.label} className="grid grid-cols-[7rem_1fr] gap-4 py-2.5">
                              <dt className="text-stone">{s.label}</dt>
                              <dd>
                                {s.value}
                                <span className={`ml-2 whitespace-nowrap text-[0.55rem] font-semibold uppercase tracking-[0.16em] ${s.verified ? "text-indigo" : "text-gold-deep"}`}>{s.verified ? "Verified" : "Target spec"}</span>
                              </dd>
                            </div>
                          ))}
                          <div className="grid grid-cols-[7rem_1fr] gap-4 py-2.5"><dt className="text-stone">Buckle</dt><dd>{product.buckle}</dd></div>
                        </dl>
                        <ul className="mt-4 list-disc space-y-1 pl-5 text-stone">{product.construction.map((c) => <li key={c}>{c}</li>)}</ul>
                      </div>
                    ),
                  },
                  { title: "Care", content: <ul className="list-disc space-y-1.5 pl-5">{product.care.map((c) => <li key={c}>{c}</li>)}</ul> },
                  {
                    title: "Compatibility",
                    content: (
                      <div className="space-y-3">
                        <p>Designed for traditional analog watches with <strong>standard spring-bar lugs</strong> of the selected width. Not for smartwatches.</p>
                        <p className="text-stone">Lug width alone does not guarantee fit. Integrated bracelets, proprietary or screw-in attachments, curved end links and very tight lug gaps may not accept this strap. Independent aftermarket strap — not affiliated with or endorsed by any watch brand.</p>
                        <Link href="/size-guide" className="inline-block text-[0.65rem] font-semibold uppercase tracking-[0.2em] link-underline-static">Read the size guide</Link>
                      </div>
                    ),
                  },
                  {
                    title: "Shipping & returns",
                    content: (
                      <div className="space-y-2">
                        <p>Ships within {site.policies.shippingRegions.join(", ")}. Dispatch time: <TBC value={site.policies.dispatchTime} />. Delivery charges: <TBC value={site.policies.shippingCharges} />.</p>
                        <p>Returns and exchanges: <TBC value={site.policies.returnWindowDays ? `${site.policies.returnWindowDays} days` : null} />. <Link href="/returns" className="underline underline-offset-2">Read the returns policy</Link>.</p>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-20" aria-labelledby="reviews-title">
        <div className="container-luxe grid gap-8 md:grid-cols-[1fr_2fr]">
          <h2 id="reviews-title" className="serif text-4xl">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="max-w-xl text-sm leading-relaxed text-stone">
              No reviews yet. Reviews will appear here only from customers who have bought and received it, and only with their permission.
            </p>
          ) : (
            <ul className="space-y-8">
              {reviews.map((r) => (
                <li key={r.id} className="border-b border-line pb-8">
                  <p className="serif text-2xl">{r.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  <p className="mt-3 text-xs text-stone">{r.author} · {r.date}{r.verifiedPurchase && " · Verified purchase"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-luxe py-28" aria-labelledby="related-title">
          <h2 id="related-title" className="serif text-headline font-light">You may also consider</h2>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <ProductCard product={p} index={i} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
