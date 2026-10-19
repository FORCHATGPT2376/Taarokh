import Link from "next/link";
import type { ReactNode } from "react";

/** Inline: **bold**, *italic*, [text](href) */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${keyBase}-${i++}`;
    if (t.startsWith("**")) out.push(<strong key={k}>{t.slice(2, -2)}</strong>);
    else if (t.startsWith("[")) {
      const [, label, href] = /\[([^\]]+)\]\(([^)]+)\)/.exec(t)!;
      out.push(
        href.startsWith("/") ? (
          <Link key={k} href={href}>
            {label}
          </Link>
        ) : (
          <a key={k} href={href} rel="noopener noreferrer" target="_blank">
            {label}
          </a>
        ),
      );
    } else out.push(<em key={k}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n").map((l) => l.trim());
        const k = `b${i}`;
        if (lines[0].startsWith("## ")) return <h2 key={k}>{inline(lines[0].slice(3), k)}</h2>;
        if (lines[0].startsWith("### ")) return <h3 key={k}>{inline(lines[0].slice(4), k)}</h3>;
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={k}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2), `${k}-${j}`)}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\.\s/.test(l)))
          return (
            <ol key={k}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\.\s/, ""), `${k}-${j}`)}</li>
              ))}
            </ol>
          );
        if (lines[0].startsWith("> "))
          return (
            <p key={k} className="border-l border-gold-deep pl-5 text-[0.95rem] italic text-stone">
              {inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), k)}
            </p>
          );
        return <p key={k}>{inline(lines.join(" "), k)}</p>;
      })}
    </>
  );
}
