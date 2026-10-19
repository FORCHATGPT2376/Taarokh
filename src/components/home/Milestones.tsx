import { publishableMilestones } from "@/data/milestones";

/** Renders nothing until a milestone is verified, approved and enabled. */
export function Milestones() {
  const items = publishableMilestones();
  if (!items.length) return null;
  return (
    <section aria-label="Milestones" className="border-y border-line py-16">
      <div className="container-luxe flex flex-wrap justify-center gap-16 text-center">
        {items.map((m) => (
          <div key={m.id}>
            <p className="serif text-6xl">{m.value}</p>
            <p className="eyebrow mt-3 text-stone">{m.label}</p>
            {m.asOf && <p className="mt-1 text-xs text-stone">as of {m.asOf}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
