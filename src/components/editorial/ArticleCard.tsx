import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { articleWords, journalCategories, type Article } from "@/data/journal";
import { readingTime } from "@/lib/format";

export function ArticleCard({ article, large, sizes = "(min-width: 1024px) 30vw, 90vw" }: { article: Article; large?: boolean; sizes?: string }) {
  return (
    <article className="group">
      <Link href={`/journal/${article.slug}`} className="block">
        <Img src={article.image} alt={article.imageAlt} aspect={large ? "3/2" : "4/3"} sizes={sizes} imgClassName="transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.04]" />
        <div className="mt-6 flex items-center gap-3 text-stone">
          <span className="eyebrow text-[0.6rem]">{journalCategories[article.category].label}</span>
          <span className="h-px w-6 bg-line-strong" aria-hidden />
          <span className="text-xs">{readingTime(articleWords(article))} min read</span>
        </div>
        <h3 className={`serif mt-3 leading-[1.1] ${large ? "text-4xl sm:text-5xl" : "text-[1.75rem]"}`}>
          <span className="link-underline">{article.title}</span>
        </h3>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-stone">{article.dek}</p>
      </Link>
    </article>
  );
}
