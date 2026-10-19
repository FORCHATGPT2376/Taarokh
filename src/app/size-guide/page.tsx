import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/editorial/PageHeader";
import { LugDiagram, SpringBarDiagram, StrapDiagram } from "@/components/sizing/Diagrams";
import { SizeAssistant } from "@/components/sizing/SizeAssistant";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Find Your Strap Size — How to Measure Watch Lug Width",
  description: "How to measure your watch's lug width and wrist size, understand strap length, buckle width and spring bars, and check compatibility before ordering.",
  alternates: { canonical: "/size-guide" },
};

const steps = [
  "Take off the watch and look at where the strap meets the case.",
  "Measure the inside distance between the lugs in millimetres, ideally with calipers.",
  "Check the existing strap's width at the watch end, and how it attaches.",
  "Select the same width on the product page and review strap length for your wrist.",
  "If the case has a curved, integrated, screw-in or proprietary attachment, ask before ordering.",
];

export default function SizeGuidePage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/size-guide", label: "Size guide" }]} eyebrow="Measure first. Wear with confidence." title={["Your watch.", "The right width."]} intro="A strap must match your watch's lug width exactly. Here's how to measure it — and what else determines a good fit." />

      <section className="container-luxe grid gap-14 border-t border-line py-20 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="eyebrow text-gold-deep">01 · Lug width</p>
          <h2 className="serif mt-4 text-title">What lug width means</h2>
          <div className="prose-luxe mt-6">
            <p>Lug width is the <strong>inside distance between the lugs</strong> — the projections at the top and bottom of the case that hold the spring bar. It is measured in millimetres and must match the strap&rsquo;s width at the watch end.</p>
            <p>Common widths are 18, 20 and 22 mm; smaller watches often use 12–16 mm, and odd sizes such as 19 or 21 mm exist on some dress and vintage watches. Our straps come in <strong>18, 20 and 22 mm</strong>.</p>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="bg-paper p-6 sm:p-10">
          <LugDiagram />
        </Reveal>
      </section>

      <section className="bg-paper py-20">
        <div className="container-luxe grid gap-12 md:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow text-gold-deep">02 · How to measure</p>
            <h2 className="serif mt-4 text-title">Five careful steps</h2>
            <p className="mt-5 text-sm leading-relaxed text-stone">Calipers give the most reliable reading. A good millimetre ruler works if you are careful. You can also check the manufacturer&rsquo;s specification for your exact model reference.</p>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-6 py-5">
                <span className="serif text-3xl leading-none text-gold-deep">{i + 1}</span>
                <span className="pt-1 leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-luxe py-24" aria-labelledby="assistant">
        <p className="eyebrow text-gold-deep">Sizing assistant</p>
        <h2 id="assistant" className="serif mt-4 text-title">Check your measurements</h2>
        <p className="mb-10 mt-4 max-w-xl text-sm leading-relaxed text-stone">Enter what you measured. The assistant compares it with the widths we design for and flags anything worth double-checking.</p>
        <SizeAssistant />
      </section>

      <section className="container-luxe grid gap-14 border-t border-line py-20 md:grid-cols-2 md:items-center">
        <div className="bg-paper p-6 sm:p-10 md:order-2"><StrapDiagram /></div>
        <div>
          <p className="eyebrow text-gold-deep">03 · Width vs length</p>
          <h2 className="serif mt-4 text-title">Strap width, buckle width and length</h2>
          <div className="prose-luxe mt-6">
            <p><strong>Strap width</strong> is measured at the lug end and must match your lug width. Most straps <strong>taper</strong> towards the buckle — so the <strong>buckle width</strong> is usually narrower. Ours taper by 2 mm — a 20 mm strap narrows to an 18 mm buckle.</p>
            <p><strong>Length</strong> is given as two numbers: the long piece (with holes) and the buckle piece. Our reference length is about 115 / 75 mm, to be confirmed on finished samples.</p>
            <p><strong>Wrist circumference</strong>: wrap a soft tape (or a strip of paper you then measure) around the wrist where you wear your watch. Snug, not tight.</p>
          </div>
        </div>
      </section>

      <section className="container-luxe grid gap-14 border-t border-line py-20 md:grid-cols-2 md:items-center">
        <div className="bg-paper p-6 sm:p-10"><SpringBarDiagram /></div>
        <div>
          <p className="eyebrow text-gold-deep">04 · Spring bars</p>
          <h2 className="serif mt-4 text-title">Standard and quick-release</h2>
          <div className="prose-luxe mt-6">
            <p>Most traditional watches hold the strap with <strong>spring bars</strong>: spring-loaded pins whose tips sit in small holes inside the lugs. Standard bars are compressed with a spring-bar tool; <strong>quick-release</strong> bars have a small lever so they can be changed by hand.</p>
            <p>Work over a soft surface, and if your watch is valuable, consider asking a watchmaker to fit the strap.</p>
          </div>
        </div>
      </section>

      <section className="dark-surface bg-indigo-deep py-24 text-ivory">
        <div className="container-luxe grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-gold">05 · Compatibility</p>
            <h2 className="serif mt-4 text-title">Why some watches need proprietary straps</h2>
          </div>
          <div className="space-y-4 leading-relaxed text-ivory/80">
            <p>Lug width alone does not guarantee fit. Some watches are designed around their own straps or bracelets:</p>
            <ul className="space-y-2 pl-5 [&>li]:list-disc">
              <li>integrated bracelets that flow directly from the case;</li>
              <li>proprietary connectors, screw-in bars or unusual lug shapes;</li>
              <li>cases with curved end links or very tight lug-to-case gaps.</li>
            </ul>
            <p>Our straps are independent aftermarket straps for standard spring-bar lugs. We don&rsquo;t claim compatibility by brand or model name — please check your watch, and <Link href="/contact" className="underline underline-offset-4">ask us</Link> if unsure. Not for smartwatches.</p>
          </div>
        </div>
      </section>

      <div className="container-luxe no-print flex justify-center py-16">
        <Link href="/shop" className="inline-flex min-h-12 items-center bg-ink px-8 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-ivory hover:bg-indigo">Choose your strap</Link>
      </div>
    </>
  );
}
