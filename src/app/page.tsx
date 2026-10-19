import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { StrapSelector } from "@/components/home/StrapSelector";
import { Milestones } from "@/components/home/Milestones";
import { ProductCard } from "@/components/product/ProductCard";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Img } from "@/components/ui/Img";
import { Reveal, MaskReveal, LineReveal, Rule } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { collections } from "@/data/collections";
import { featuredProducts, publishedProducts } from "@/data/products";
import { articles } from "@/data/journal";
import { site } from "@/data/site";

export default function Home() {
  const featured = featuredProducts();
  const showcase = [...featured, ...publishedProducts().filter((p) => !p.featured)].slice(0, 6);
  const journal = articles.filter((a) => a.featured).slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TAAROKH | JAIPUR",
    url: site.url,
    potentialAction: { "@type": "SearchAction", target: `${site.url}/search?q={query}`, "query-input": "required name=query" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />

      {/* 2 — Editorial introduction */}
      <section className="container-luxe py-28 sm:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 lg:col-start-1">
            <Reveal>
              <p className="eyebrow text-gold-deep">The house</p>
            </Reveal>
            <h2 className="serif mt-8 text-headline font-light">
              <LineReveal lines={["A different", "expression of time."]} />
            </h2>
            <Reveal delay={0.2} className="mt-10 max-w-md">
              <p className="text-lg leading-relaxed text-ink-soft">
                A watch is personal. The strap should be too. TAAROKH explores the meeting point between Jaipur&rsquo;s distinctive design traditions and the contemporary art of wearing a watch.
              </p>
              <ButtonLink href="/our-story" variant="text" arrow className="mt-8">
                Read our story
              </ButtonLink>
            </Reveal>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8">
            <MaskReveal>
              <Img src="/images/photos/carved-block-paisley.jpg" alt="A hand-carved wooden textile printing block with a paisley and floral design." aspect="4/5" sizes="(min-width: 1024px) 40vw, 90vw" />
            </MaskReveal>
            <p className="serif absolute -bottom-12 -right-4 hidden text-[7rem] leading-none text-sand/70 italic lg:block" aria-hidden>
              taar
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Collections */}
      <section className="bg-paper py-28 sm:py-36" aria-labelledby="collections-title">
        <div className="container-luxe">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Reveal>
                <p className="eyebrow text-gold-deep">The collections</p>
              </Reveal>
              <h2 id="collections-title" className="serif mt-6 text-headline font-light">
                <LineReveal lines={["Three studies in", "colour and detail."]} />
              </h2>
            </div>
            <Reveal delay={0.2} className="max-w-sm text-stone">
              <p>From small floral repeats to earth-toned geometry, each design begins with a different view of Jaipur.</p>
            </Reveal>
          </div>
          <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-3">
            {collections.map((c, i) => (
              <Reveal key={c.handle} delay={i * 0.12} className={i === 1 ? "md:mt-24" : i === 2 ? "md:mt-48" : ""}>
                <Link href={`/collections/${c.handle}`} className="group block">
                  <div className="relative overflow-hidden">
                    <Img src={c.image} alt={c.imageAlt} aspect="4/5" sizes="(min-width: 768px) 32vw, 90vw" imgClassName="transition-transform duration-[1.8s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]" />
                    <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/15" />
                  </div>
                  <div className="mt-7 flex items-baseline gap-5">
                    <span className="serif text-lg text-gold-deep">{c.number}</span>
                    <div>
                      <h3 className="eyebrow text-[0.8rem] tracking-[0.42em]">{c.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-stone">{c.tagline}</p>
                      <span className="mt-5 inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em]">
                        <span className="link-underline-static">Explore collection</span>
                        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Product showcase */}
      <section className="container-luxe py-28 sm:py-40" aria-labelledby="showcase-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-gold-deep">The straps</p>
            </Reveal>
            <h2 id="showcase-title" className="serif mt-6 text-headline font-light">
              <LineReveal lines={["Designed to", "transform", "the familiar."]} />
            </h2>
          </div>
          <Reveal delay={0.2} className="self-end lg:col-span-5 lg:col-start-8">
            <p className="leading-relaxed text-stone">
              The first collection: two-piece straps for traditional watches with standard 18, 20 or 22&nbsp;mm lugs. Pre-order now and pay cash on delivery.
            </p>
            <ButtonLink href="/shop" variant="text" arrow className="mt-6">
              View all straps
            </ButtonLink>
          </Reveal>
        </div>
        <Rule className="mt-16" />
        <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.1}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5 — Jaipur story */}
      <section className="dark-surface relative overflow-hidden bg-ink text-ivory" aria-labelledby="story-title">
        <div className="relative h-[70svh] min-h-[28rem] md:h-[88svh]">
          <div className="absolute inset-0">
            <Img src="/images/photos/hawa-mahal-facade.jpg" alt="The pink sandstone façade of the Hawa Mahal in Jaipur, with tiers of small windows and jharokhas." className="h-full !bg-ink" sizes="100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="container-luxe absolute inset-x-0 bottom-0 pb-16 sm:pb-24">
            <Reveal>
              <p className="eyebrow text-sand">The inspiration</p>
            </Reveal>
            <h2 id="story-title" className="serif mt-6 text-headline font-light">
              <LineReveal lines={["From the streets of Jaipur", "to the wrist."]} />
            </h2>
          </div>
        </div>
        <div className="container-luxe grid gap-12 py-20 sm:py-28 md:grid-cols-3">
          {[
            ["The planned city", "Founded in 1727, Jaipur was laid out on a grid of broad streets and repeated façades. That sense of order — rhythm, repetition, proportion — is the first thing we design with."],
            ["The printed cloth", "Sanganer and Bagru, close to the city, are known for hand-block printing: fine florals and earthy lattices built from small repeated motifs. We draw our own motifs at the scale of a strap."],
            ["The screened window", "Jharokhas and jaali screens turn sunlight into pattern. Our Jharokha studies abstract the cusped arch into a single fine line."],
          ].map(([h, t], i) => (
            <Reveal key={h} delay={i * 0.12}>
              <p className="serif text-sm text-gold">0{i + 1}</p>
              <h3 className="serif mt-3 text-3xl">{h}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ivory/70">{t}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 6 — Materials & detail */}
      <section className="container-luxe py-28 sm:py-40" aria-labelledby="materials-title">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow text-gold-deep">Materials &amp; detail</p>
          </Reveal>
          <h2 id="materials-title" className="serif mt-6 text-headline font-light">
            <LineReveal lines={["Considered,", "layer by layer."]} />
          </h2>
        </div>
        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {[
            { k: "The fabric", img: "/images/photos/block-printed-cotton-detail.jpg", alt: "Detail of an old hand-block-printed cotton textile with small floral butis (museum collection).", t: "Our prints take their cue from cloth like this: small florals, printed by hand. Ours is a tightly woven printed cotton or canvas, chosen for how it holds a fine motif; exact composition is confirmed per product." },
            { k: "The stitch", img: "/images/products/_material/03-detail.jpg", alt: "Concept render: close-up of edge stitching and strap holes on a midnight lattice print.", t: "Stitched edges with reinforcement where the strap takes the most strain — at the spring bars and the buckle. Each sample is checked for stitch tension and loose ends." },
            { k: "The finish", img: "/images/products/_finish/04-buckle.jpg", alt: "Concept render: a brushed steel tang buckle and keepers on an ochre strap.", t: "Sealed edges tested against fraying, and a corrosion-resistant tang buckle sized to the strap's taper. Hardware finishes are confirmed after sampling." },
          ].map((m, i) => (
            <Reveal key={m.k} delay={i * 0.12} className={i === 1 ? "md:mt-20" : ""}>
              <Img src={m.img} alt={m.alt} aspect="4/5" sizes="(min-width: 768px) 30vw, 90vw" />
              <h3 className="eyebrow mt-7">{m.k}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone">{m.t}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 flex justify-center">
          <ButtonLink href="/the-craft" variant="outline" arrow>
            See the fabrics behind the design
          </ButtonLink>
        </Reveal>
      </section>

      {/* 7 — Interactive selector */}
      <section className="border-y border-line bg-paper py-28 sm:py-36" aria-label="Strap studio">
        <div className="container-luxe">
          <StrapSelector products={publishedProducts()} />
        </div>
      </section>

      {/* 8 — Philosophy */}
      <section className="dark-surface relative overflow-hidden bg-ink text-ivory" aria-labelledby="philosophy-title">
        <div className="absolute inset-0">
          <Img src="/images/photos/hawa-mahal-night.jpg" alt="" className="h-full !bg-ink" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        </div>
        <div className="container-luxe relative py-36 sm:py-52">
          <Reveal>
            <p className="eyebrow text-gold">Philosophy</p>
          </Reveal>
          <h2 id="philosophy-title" className="serif mt-8 text-display font-light">
            <LineReveal lines={["Every detail", "has a story."]} />
          </h2>
          <Reveal delay={0.3} className="mt-10 max-w-md">
            <p className="leading-relaxed text-ivory/75">
              We test patterns at the scale of a watch strap, choose practical materials, and focus on the fit and construction that matter most. Where a detail comes from a specific place or process, we will say so — and only when we can show it.
            </p>
          </Reveal>
        </div>
      </section>

      <Milestones />

      {/* 9 — Journal */}
      <section className="container-luxe py-28 sm:py-40" aria-labelledby="journal-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="eyebrow text-gold-deep">The journal</p>
            </Reveal>
            <h2 id="journal-title" className="serif mt-6 text-headline font-light">
              <LineReveal lines={["Notes on craft", "and time."]} />
            </h2>
          </div>
          <ButtonLink href="/journal" variant="text" arrow>
            All stories
          </ButtonLink>
        </div>
        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8">
          {journal.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.12}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10 — Newsletter */}
      <section id="newsletter" className="relative scroll-mt-24 overflow-hidden bg-indigo-deep text-ivory dark-surface">
        <div className="container-luxe grid gap-14 py-28 sm:py-36 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow text-gold">Newsletter</p>
            <h2 className="serif mt-6 text-headline font-light">
              <LineReveal lines={["Notes from Jaipur."]} />
            </h2>
            <p className="mt-6 max-w-sm text-ivory/70">New collections, design stories, and occasional updates.</p>
          </div>
          <div className="lg:pb-2">
            <NewsletterForm tone="dark" source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
