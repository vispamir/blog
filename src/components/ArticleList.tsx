import Link from "next/link";
import { articleThumbnail } from "@/lib/article-images";
import { ArrowUpLeft } from "lucide-react";
import { categoryBySlug } from "@/lib/categories";
import type { SearchArticle } from "@/lib/search";
export function CategoryLabel({ slug }: { slug: string }) {
  const c = categoryBySlug(slug);
  return c ? (
    <Link
      className={`category-label ${c.color}`}
      href={`/categories/${c.slug}/`}
    >
      {c.title}
    </Link>
  ) : null;
}
export function ArticleList({
  articles,
  compact = false,
  headingLevel = 3,
  thumbnails = false,
}: {
  articles: Omit<SearchArticle, "text">[];
  compact?: boolean;
  headingLevel?: 2 | 3;
  thumbnails?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      className={`article-list ${compact ? "compact" : ""} ${thumbnails ? "with-thumbnails" : ""}`}
    >
      {articles.map((a, i) => (
        <article className="article-row" key={a.slug}>
          {thumbnails && (
            <Link
              className="article-thumbnail"
              href={`/articles/${a.slug}/`}
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                src={articleThumbnail(
                  a.slug,
                  `/images/${["stones", "notebook", "desk", "vase"][i % 4]}.webp`,
                )}
                alt=""
                width={168}
                height={134}
                loading="lazy"
              />
            </Link>
          )}
          <span className="row-index" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="row-body">
            <CategoryLabel slug={a.category} />
            <Heading>
              <Link href={`/articles/${a.slug}/`}>{a.title}</Link>
            </Heading>
            <p>{a.description}</p>
            <div className="metadata">
              <time dateTime={a.date}>
                {new Intl.DateTimeFormat("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                }).format(new Date(a.date))}
              </time>
              <span>·</span>
              <span>{a.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
              {a.featured && <span className="featured-label">منتخب</span>}
            </div>
          </div>
          <Link
            className="row-arrow"
            href={`/articles/${a.slug}/`}
            aria-label={`خواندن ${a.title}`}
          >
            <ArrowUpLeft size={21} strokeWidth={1.3} />
          </Link>
        </article>
      ))}
    </div>
  );
}
