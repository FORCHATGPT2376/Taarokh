import Link from "next/link";
import { journalCategories, type JournalCategory } from "@/data/journal";
import { cx } from "@/lib/format";

export function JournalNav({ active }: { active?: JournalCategory }) {
  const items = [{ href: "/journal", label: "All stories", on: !active }, ...Object.entries(journalCategories).map(([k, v]) => ({ href: `/journal/category/${k}`, label: v.label, on: active === k }))];
  return (
    <nav aria-label="Journal categories" className="container-luxe">
      <ul className="flex gap-6 overflow-x-auto border-b border-line pb-px">
        {items.map((i) => (
          <li key={i.href} className="shrink-0">
            <Link href={i.href} aria-current={i.on ? "page" : undefined} className={cx("block border-b py-4 text-[0.66rem] font-semibold uppercase tracking-[0.22em] transition-colors", i.on ? "border-ink text-ink" : "border-transparent text-stone hover:text-ink")}>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
