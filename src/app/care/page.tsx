import type { Metadata } from "next";
import { PageHeader } from "@/components/editorial/PageHeader";
import { Img } from "@/components/ui/Img";

export const metadata: Metadata = { title: "Strap Care", description: "How to care for a printed fabric watch strap: moisture, cleaning, storage and changing straps safely.", alternates: { canonical: "/care" } };

const sections = [
  ["Everyday wear", ["Keep dry when possible. Treat a printed fabric strap as a textile accessory, not a waterproof strap.", "Remove it before swimming, showering, washing up or exercise that causes heavy sweating.", "If it gets wet, blot gently and let it dry flat at room temperature — never on a radiator or in direct sun."]],
  ["Cleaning", ["Wipe gently with a soft, dry cloth.", "For marks, use a barely damp cloth and dab rather than rub. Lighter grounds show marks more readily.", "Do not machine wash, bleach or use solvents. Product-specific instructions take priority."]],
  ["Storage", ["Store flat or loosely coiled, away from direct sunlight, to protect printed colours.", "Keep away from sharp objects that could snag the stitching."]],
  ["Changing straps safely", ["Work over a soft cloth on a table.", "Use a proper spring-bar tool, or the lever on quick-release bars.", "Check that both spring-bar tips are fully seated in the lug holes before wearing — give the strap a gentle tug.", "For valuable watches, consider asking a watchmaker."]],
] as const;

export default function CarePage() {
  return (
    <>
      <PageHeader crumbs={[{ href: "/care", label: "Strap care" }]} eyebrow="Care" title={["Looking after", "your strap."]} intro="A little care keeps a textile strap looking considered for longer." />
      <section className="container-luxe grid gap-16 pb-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Img src="/images/editorial/on-cloth.jpg" alt="Concept render: an unbranded watch on an ivory floral strap, resting on folded indigo cloth." aspect="4/5" sizes="(min-width:1024px) 40vw, 100vw" note="Concept render" imgClassName="object-[60%_50%]" />
        </div>
        <div className="space-y-12 lg:col-span-6 lg:col-start-7">
          {sections.map(([t, items], i) => (
            <div key={t} className="border-t border-line pt-6">
              <p className="eyebrow text-gold-deep">0{i + 1}</p>
              <h2 className="serif mt-3 text-3xl">{t}</h2>
              <ul className="prose-luxe mt-4">{items.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
