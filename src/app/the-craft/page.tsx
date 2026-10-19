import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Img } from "@/components/ui/Img";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Craft — Textiles, Construction & Provenance",
  description: "How TAAROKH straps are designed and built: textiles, original patterns, construction, materials, finishing and care — and how we describe provenance honestly.",
  alternates: { canonical: "/the-craft" },
};

/**
 * Verified supplier / production records. Add entries only with documentation
 * and written permission. Rendered in the "Credits" module when non-empty.
 */
const credits: { stage: string; name: string; location: string; verifiedOn: string }[] = [];

const modules = [
  {
    k: "Textiles",
    title: "Cloth chosen for a small canvas.",
    img: "/images/editorial/material-fabric.jpg",
    alt: "Concept render: macro of a printed ivory textile with visible weave.",
    body: [
      "A strap is narrow, flexes thousands of times a day and sits against skin. We are evaluating tightly woven cottons and canvases that hold a fine print, keep their shape when reinforced, and feel comfortable in warm weather.",
      "The exact composition of each strap's fabric will be published on its product page once confirmed with the supplier.",
    ],
  },
  {
    k: "Patterns",
    title: "Inspired by tradition, drawn from first principles.",
    img: "/images/editorial/swatch-board.jpg",
    alt: "Concept render: seven print swatches — florals, lattices and arcades — side by side.",
    body: [
      "Every TAAROKH print is an original drawing, made at the scale of a watch strap: the Sanganer buti, the Bagru jaal, the Jharokha arcade.",
      "We use the vocabulary of these traditions — scale, repetition, palette — without copying any existing block, protected artwork or building.",
    ],
  },
  {
    k: "Construction",
    title: "Three layers, stitched with intent.",
    img: "/images/editorial/construction.jpg",
    alt: "Illustration: exploded view of a strap's layers — printed textile, reinforcement and lining.",
    body: [
      "A printed outer, an inner reinforcement for structure, and a comfort lining. Stitching runs along both edges, with extra reinforcement where the strap takes most strain: around the spring bar and at the buckle.",
      "Reinforcement and lining materials are chosen and tested with the maker during sampling.",
    ],
  },
  {
    k: "Materials",
    title: "Hardware that disappears.",
    img: "/images/products/_finish/04-buckle.jpg",
    alt: "Concept render: a brushed steel tang buckle on an ochre strap.",
    body: [
      "A corrosion-resistant tang buckle sized to the strap's taper, and correctly dimensioned spring bars. Quick-release bars will only be offered once strength, tolerance and fit checks pass.",
    ],
  },
  {
    k: "Finishing",
    title: "Edges that stay clean.",
    img: "/images/products/sanganer-ivory/03-detail.jpg",
    alt: "Concept render: close-up of stitched edges and holes on an ivory floral strap.",
    body: [
      "Fabric edges are where cheap straps fail first. Ours are sealed and tested against fraying and delamination, and samples are inspected under consistent light for loose ends and uneven tension before any batch is approved.",
    ],
  },
];

const tests = [
  ["Dimensional inspection", "Width at each lug end, buckle width, hole spacing and finished lengths checked with calipers."],
  ["Wear trial", "At least seven days of ordinary wear across several testers and wrist sizes, recording comfort, slipping and rough edges."],
  ["Colourfastness screen", "Damp-cloth rub and sweat-exposure checks; formal textile testing where a claim requires it."],
  ["Mechanical inspection", "Repeated attachment cycles, buckle operation, stitch integrity and careful pull testing."],
  ["Fit verification", "Fitted to several watches with standard 18, 20 and 22 mm lugs, recording any clearance problems. No universal-fit claims."],
];

export default function CraftPage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/the-craft", label: "The Craft" }]} eyebrow="The craft" title={["See the fabrics", "behind the design."]} intro="How our straps are designed, built and tested — and how we describe where things come from." />

      <section className="dark-surface bg-indigo-deep py-20 text-ivory">
        <div className="container-luxe grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow text-gold">Inspired by ≠ made by</p>
            <h2 className="serif mt-5 text-title">A distinction we take seriously.</h2>
          </div>
          <div className="space-y-4 leading-relaxed text-ivory/80 md:col-span-7 md:col-start-6">
            <p><strong className="text-ivory">A design inspired by block printing</strong> borrows the visual language of a tradition — its motifs, rhythm and palette. It may be printed by any method.</p>
            <p><strong className="text-ivory">Fabric genuinely hand-block printed</strong> was printed by hand with carved wooden blocks — and, for Sanganeri or Bagru printing, in a specific place recognised by a Geographical Indication.</p>
            <p>Our product pages will state exactly which stages — fabric source, printing method, assembly — are verified for each strap. Until then, we say &ldquo;inspired by&rdquo;, and nothing more.</p>
          </div>
        </div>
      </section>

      {modules.map((m, i) => (
        <section key={m.k} className="container-luxe grid items-center gap-12 border-b border-line py-20 md:grid-cols-12 md:py-28" aria-labelledby={`m-${i}`}>
          <Reveal className={cx("md:col-span-6", i % 2 === 1 && "md:order-2 md:col-start-7")}>
            <Img src={m.img} alt={m.alt} aspect={m.k === "Patterns" || m.k === "Construction" ? "3/2" : "4/5"} sizes="(min-width: 768px) 50vw, 100vw" note={m.k === "Construction" ? "Illustration" : "Concept render"} />
          </Reveal>
          <Reveal delay={0.15} className={cx("md:col-span-5", i % 2 === 1 ? "md:order-1 md:col-start-1" : "md:col-start-8")}>
            <p className="eyebrow text-gold-deep">{String(i + 1).padStart(2, "0")} · {m.k}</p>
            <h2 id={`m-${i}`} className="serif mt-5 text-title">{m.title}</h2>
            <div className="mt-6 space-y-4 leading-relaxed text-stone">{m.body.map((b) => <p key={b}>{b}</p>)}</div>
          </Reveal>
        </section>
      ))}

      <section className="bg-paper py-24">
        <div className="container-luxe">
          <p className="eyebrow text-gold-deep">Quality gates</p>
          <h2 className="serif mt-5 max-w-2xl text-title">What a sample must pass before it goes on sale.</h2>
          <ol className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {tests.map(([t, d], i) => (
              <li key={t} className="bg-paper p-6">
                <p className="serif text-3xl text-gold-deep">{i + 1}</p>
                <p className="mt-4 font-semibold">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-luxe grid gap-12 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow text-gold-deep">06 · Care</p>
          <h2 className="serif mt-5 text-title">Looking after a textile strap.</h2>
          <ul className="prose-luxe mt-6">
            <li>Keep dry when possible — treat it as a textile accessory, not a waterproof strap.</li>
            <li>Wipe gently with a soft, dry cloth. Do not machine wash.</li>
            <li>Remove for swimming, showering and heavy exercise.</li>
            <li>Store flat, away from direct sunlight.</li>
          </ul>
          <ButtonLink href="/care" variant="text" arrow className="mt-6">Full care guide</ButtonLink>
        </div>
        <div>
          <p className="eyebrow text-gold-deep">Credits &amp; collaborations</p>
          <h2 className="serif mt-5 text-title">Named only with permission.</h2>
          {credits.length === 0 ? (
            <p className="mt-6 leading-relaxed text-stone">
              We intend to work with textile printers and strap makers, and to credit them by name. Partners, places and dates will appear here only once collaborations are real, documented and approved by the people involved.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-line">
              {credits.map((c) => (
                <li key={c.name} className="py-3 text-sm"><strong>{c.stage}</strong> — {c.name}, {c.location} <span className="text-stone">(verified {c.verifiedOn})</span></li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
