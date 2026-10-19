import type { ReactNode } from "react";

export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; content: ReactNode }[]; defaultOpen?: number }) {
  return (
    <div className="border-t border-line">
      {items.map((it, i) => (
        <details key={it.title} className="group border-b border-line" open={i === defaultOpen}>
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.22em]">
            {it.title}
            <span aria-hidden className="relative h-3 w-3">
              <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
              <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-500 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="pb-6 text-sm leading-relaxed text-ink-soft">{it.content}</div>
        </details>
      ))}
    </div>
  );
}
