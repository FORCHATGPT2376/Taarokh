import type { Metadata } from "next";
import { Img } from "@/components/ui/Img";
import { LineReveal, MaskReveal, Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/editorial/Breadcrumbs";

export const metadata: Metadata = {
  title: "Our Story — Born of Jaipur",
  description: "Why TAAROKH exists: contemporary straps for traditional watches, drawing on Jaipur's textile traditions and architecture — told without exaggeration.",
  alternates: { canonical: "/our-story" },
};

export default function StoryPage() {
  return (
    <>
      <section className="container-luxe pt-12 sm:pt-20">
        <Breadcrumbs items={[{ href: "/our-story", label: "Our Story" }]} />
        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow text-gold-deep">Our story</p>
            <h1 className="serif mt-6 text-display font-light">
              <LineReveal immediate lines={["Born of", "Jaipur."]} />
            </h1>
          </div>
          <Reveal delay={0.4} className="self-end md:col-span-4 md:col-start-9">
            <p className="serif text-2xl leading-snug">A watch is often worn for years. A strap lets it feel different in a moment.</p>
          </Reveal>
        </div>
      </section>

      <MaskReveal className="container-luxe mt-16">
        <Img src="/images/editorial/jaipur-facade.jpg" alt="Original illustration: a pink-washed façade with cusped arches and white line ornament, lit by warm light." priority sizes="100vw" note="Original illustration" className="h-72 sm:h-auto sm:aspect-[21/9]" />
      </MaskReveal>

      <section className="container-luxe grid gap-12 py-24 md:grid-cols-12 sm:py-32">
        <p className="eyebrow text-gold-deep md:col-span-3">01 · The question</p>
        <div className="prose-luxe md:col-span-7 md:col-start-5">
          <p className="!text-xl !leading-relaxed text-ink">TAAROKH began with a simple design question: what if a traditional watch could carry a small piece of Jaipur&rsquo;s visual identity?</p>
          <p>We are developing straps that translate textile patterns and architectural details into accessories people can actually wear every day. Our first focus is fit, finishing and fabrics that feel as considered as the watches they accompany.</p>
          <p>The name is our own: a coined word that brings together <em>taar</em> — thread — and the <em>jharokha</em>, the screened window of Rajasthani architecture. It is a creative explanation, not a dictionary etymology.</p>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-32">
        <div className="container-luxe grid items-center gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <Img src="/images/editorial/triptych.jpg" alt="Concept render: one unbranded watch shown on three different printed straps." aspect="4/5" sizes="(min-width:768px) 40vw, 100vw" imgClassName="object-[50%_50%]" note="Concept render" />
          </Reveal>
          <div className="md:col-span-6 md:col-start-7">
            <p className="eyebrow text-gold-deep">02 · Why the strap</p>
            <h2 className="serif mt-5 text-title">Identity, worn at the wrist.</h2>
            <div className="prose-luxe mt-6">
              <p>For many people a watch is the one piece of jewellery they wear every day. The case and dial rarely change — but the strap can, in a minute, and with it the watch&rsquo;s whole character.</p>
              <p>We think that makes the strap the most personal part of a watch: the place where taste, occasion and memory show. Most replacement straps are generic. We want ours to carry a point of view.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-12 py-24 md:grid-cols-12 sm:py-32">
        <p className="eyebrow text-gold-deep md:col-span-3">03 · Jaipur</p>
        <div className="prose-luxe md:col-span-7 md:col-start-5">
          <h2 className="!mt-0">A city built on pattern.</h2>
          <p>Founded in 1727 as a planned city, Jaipur is a place of repetition and rhythm: gridded streets, arcaded façades, screened windows that turn sunlight into pattern on the floor.</p>
          <p>Close by, Sanganer and Bagru are known for hand-block printing — fine florals on light grounds; earthy lattices in black and madder red. Both crafts are registered Geographical Indications in India.</p>
          <p>These traditions work on a watch strap for a practical reason: they are built from <strong>small, repeated motifs</strong>. A pattern designed to be printed by hand, one block at a time, already understands scale and rhythm — exactly what a strap twenty millimetres wide needs.</p>
        </div>
      </section>

      <section className="dark-surface bg-ink py-24 text-ivory sm:py-32">
        <div className="container-luxe grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-gold">04 · Our approach</p>
            <h2 className="serif mt-5 text-title">Honest about where we are.</h2>
            <p className="mt-6 leading-relaxed text-ivory/70">
              TAAROKH is at the beginning. The designs on this site are concepts; samples are in development. We would rather show you that plainly than borrow a history we haven&rsquo;t earned.
            </p>
          </div>
          <ol className="space-y-10 md:col-span-6 md:col-start-7">
            {[
              ["Design research", "Every print is drawn from first principles for the scale of a strap — inspired by tradition, never copied from an existing block or artwork."],
              ["Tested construction", "No strap goes on sale until samples pass dimensional checks, wear trials, colourfastness screening and attachment tests."],
              ["Transparent origin", "Where fabric comes from, how it was printed and where the strap was assembled will be stated per product — only once verified. We'll explore local materials and makers, and credit them only with their permission."],
            ].map(([t, d], i) => (
              <li key={t} className="border-t border-line-dark pt-6">
                <p className="serif text-sm text-gold">0{i + 1}</p>
                <p className="serif mt-2 text-3xl">{t}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/70">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-luxe flex flex-col items-center py-28 text-center">
        <p className="serif max-w-2xl text-4xl leading-tight sm:text-5xl">Follow the first collection as it takes shape.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/shop" arrow>Explore the concepts</ButtonLink>
          <ButtonLink href="/#newsletter" variant="outline">Get the launch update</ButtonLink>
        </div>
      </section>
    </>
  );
}
