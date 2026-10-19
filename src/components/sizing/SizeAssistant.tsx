"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { products } from "@/data/products";
import { variantAvailability } from "@/lib/commerce/availability";

const offered = [...new Set(products.flatMap((p) => p.variants.filter((v) => variantAvailability(p, v).max > 0).map((v) => v.lugWidthMm)))].sort();
const planned = [...new Set(products.flatMap((p) => p.variants.filter((v) => v.status === "planned").map((v) => v.lugWidthMm)))].sort();

type Result = { tone: "ok" | "warn" | "info"; title: string; body: string };

function lugResult(mm: number): Result {
  if (!isFinite(mm) || mm < 8 || mm > 30) return { tone: "warn", title: "That doesn't look like a lug width.", body: "Lug widths on traditional watches usually fall between 10 and 26 mm. Measure the inside distance between the lugs, in millimetres." };
  const nearest = Math.round(mm);
  const off = Math.abs(mm - nearest);
  if (off > 0.3) return { tone: "warn", title: `Between sizes (${mm} mm).`, body: `Please measure again with calipers, as close to the spring bar as possible. If you still read ${mm} mm, contact us before ordering — a strap that is too wide or too narrow will not fit properly.` };
  if (offered.includes(nearest)) return { tone: "ok", title: `${nearest} mm — this is a width we design for.`, body: `Choose ${nearest} mm on the product page. Before ordering, confirm your watch uses standard spring bars and has enough clearance between the bar and the case.` };
  if (planned.includes(nearest)) return { tone: "info", title: `${nearest} mm — planned, not yet offered.`, body: `${nearest} mm is under consideration for a later run. Join the newsletter or contact us so we know there is demand for this width.` };
  return { tone: "info", title: `${nearest} mm — not currently in our range.`, body: `Our first collection is designed around ${offered.join(", ")} mm lugs. ${nearest % 2 === 1 ? "Odd widths are common on some dress and vintage watches. " : ""}Please don't size up or down — a mismatched strap will not sit correctly.` };
}

function wristResult(cm: number): Result {
  if (!isFinite(cm) || cm < 11 || cm > 26) return { tone: "warn", title: "Please check that measurement.", body: "Measure around the wrist where you wear your watch, in centimetres — most adult wrists measure between 14 and 22 cm." };
  if (cm < 15) return { tone: "info", title: `${cm} cm — a smaller wrist.`, body: "The standard reference length (≈ 115 / 75 mm) may be long for you, depending on your watch. Contact us with your wrist size and watch model and we'll advise once sample lengths are tested." };
  if (cm > 20) return { tone: "info", title: `${cm} cm — a larger wrist.`, body: "The standard reference length may be short for you. Contact us — longer lengths will be considered based on demand." };
  return { tone: "ok", title: `${cm} cm — within the range the standard length is intended for.`, body: "Final fit also depends on your watch's lug-to-lug size and hole positions, which will be confirmed on finished samples. This is guidance, not a guarantee." };
}

export function SizeAssistant() {
  const id = useId();
  const [lug, setLug] = useState("");
  const [wrist, setWrist] = useState("");
  const [r1, setR1] = useState<Result | null>(null);
  const [r2, setR2] = useState<Result | null>(null);
  const toneCls = { ok: "border-indigo text-indigo", warn: "border-error text-error", info: "border-gold-deep text-gold-deep" };

  const box = (r: Result | null) =>
    r && (
      <div className={`mt-5 border-l-2 pl-4 ${toneCls[r.tone]}`} role="status">
        <p className="serif text-2xl text-ink">{r.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
      </div>
    );

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setR1(lugResult(parseFloat(lug.replace(",", "."))));
        }}
        className="border border-line bg-paper p-6 sm:p-8"
        aria-labelledby={`${id}-a`}
      >
        <p id={`${id}-a`} className="eyebrow text-gold-deep">Step 1 · Lug width</p>
        <label htmlFor={`${id}-lug`} className="mt-4 block text-sm text-stone">Your measurement between the lugs</label>
        <div className="mt-2 flex items-end gap-3">
          <div className="flex flex-1 items-baseline border-b border-ink">
            <input id={`${id}-lug`} inputMode="decimal" value={lug} onChange={(e) => setLug(e.target.value)} placeholder="20" className="serif w-full bg-transparent py-2 text-4xl outline-none" />
            <span className="text-sm text-stone">mm</span>
          </div>
          <button type="submit" className="min-h-12 bg-ink px-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-indigo">Check</button>
        </div>
        <div aria-live="polite">{box(r1)}</div>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setR2(wristResult(parseFloat(wrist.replace(",", "."))));
        }}
        className="border border-line bg-paper p-6 sm:p-8"
        aria-labelledby={`${id}-b`}
      >
        <p id={`${id}-b`} className="eyebrow text-gold-deep">Step 2 · Wrist size</p>
        <label htmlFor={`${id}-wrist`} className="mt-4 block text-sm text-stone">Wrist circumference where you wear your watch</label>
        <div className="mt-2 flex items-end gap-3">
          <div className="flex flex-1 items-baseline border-b border-ink">
            <input id={`${id}-wrist`} inputMode="decimal" value={wrist} onChange={(e) => setWrist(e.target.value)} placeholder="17" className="serif w-full bg-transparent py-2 text-4xl outline-none" />
            <span className="text-sm text-stone">cm</span>
          </div>
          <button type="submit" className="min-h-12 bg-ink px-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory hover:bg-indigo">Check</button>
        </div>
        <div aria-live="polite">{box(r2)}</div>
        <p className="mt-6 text-xs text-stone">Not sure? <Link href="/contact" className="underline underline-offset-2">Send us your watch model</Link> and a photo of the lugs.</p>
      </form>
    </div>
  );
}
