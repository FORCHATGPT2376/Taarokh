"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityControl({ value, max, onChange, label, size = "md" }: { value: number; max: number; onChange: (n: number) => void; label: string; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-10" : "h-12";
  return (
    <div className={`inline-flex ${h} items-stretch border border-line-strong`} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className="grid w-10 place-items-center transition-colors hover:bg-ink/5 disabled:opacity-30" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        <Minus size={13} strokeWidth={1.25} />
      </button>
      <output className="grid min-w-9 place-items-center text-sm tabular-nums" aria-live="polite">
        {value}
      </output>
      <button type="button" className="grid w-10 place-items-center transition-colors hover:bg-ink/5 disabled:opacity-30" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus size={13} strokeWidth={1.25} />
      </button>
    </div>
  );
}
