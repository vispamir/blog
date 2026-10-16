import Link from "next/link";
import { articleThumbnail } from "@/lib/article-images";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMermaid from "@/lib/remark-mermaid";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import GithubSlugger from "github-slugger";
import {
  getArticles,
  getArticle,
  relatedArticles,
  dateFa,
} from "@/lib/articles";
import { ArrowRight, ArrowLeft, FileText, Heart } from "lucide-react";
import { CategoryLabel } from "@/components/ArticleList";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { site, absolute } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: absolute(`/articles/${slug}/`) },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.description,
      publishedTime: a.date,
      modifiedTime: a.updatedAt,
      authors: [site.name],
      url: absolute(`/articles/${slug}/`),
    },
    twitter: { card: "summary", title: a.title, description: a.description },
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const all = getArticles();
  const index = all.findIndex((x) => x.slug === slug);
  const related = relatedArticles(a, all);
  const slugger = new GithubSlugger();
  let inCode = false;
  const headings = a.content.split("\n").flatMap((line) => {
    if (line.startsWith("```")) {
      inCode = !inCode;
      return [];
    }
    const m = !inCode && /^(#{2,3})\s+(.+)$/.exec(line);
    return m
      ? [{ depth: m[1].length, title: m[2], id: slugger.slug(m[2]) }]
      : [];
  });
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updatedAt ?? a.date,
    author: { "@type": "Person", name: site.name },
    inLanguage: "fa-IR",
    url: absolute(`/articles/${slug}/`),
  };
  return (
    <>
      <div className="post-layout shell" data-article={a.slug}>
        <article className="post-main">
          <header className="post-header">
            <CategoryLabel slug={a.category} />
            <h1>{a.title}</h1>
            <div className="post-meta">
              <span>
                <FileText size={14} strokeWidth={1.4} />
                <time dateTime={a.date}>{dateFa(a.date)}</time>
                <span>·</span>
                {a.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه
              </span>
              <span className="post-meta-tags">
                <Heart size={14} strokeWidth={1.4} />
                {a.tags.slice(0, 3).join("، ")}
              </span>
              {a.updatedAt && (
                <span className="post-updated">
                  آخرین ویرایش:{" "}
                  <time dateTime={a.updatedAt}>{dateFa(a.updatedAt)}</time>
                </span>
              )}
            </div>
          </header>
          <img
            className="post-cover"
            src={a.cover ?? "/images/post-workspace.webp"}
            alt={
              a.cover
                ? `تصویر همراه نوشته‌ی ${a.title}`
                : "میز چوبی، دفتر یادداشت و گلدان در کنار پنجره‌ای رو به کوهستان"
            }
            width={1200}
            height={420}
            fetchPriority="high"
          />
          {headings.length > 0 && (
            <details className="post-mobile-toc">
              <summary>فهرست مطالب</summary>
              <nav aria-label="فهرست مطالب همراه">
                <ol>
                  {headings.map((h) => (
                    <li className={h.depth === 3 ? "nested" : ""} key={h.id}>
                      <a href={`#${h.id}`}>{h.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </details>
          )}
          <div className="prose post-prose">
            <MDXRemote
              source={a.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkMermaid, remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [
                      rehypePrettyCode,
                      { theme: "github-light", keepBackground: false },
                    ],
                  ],
                },
              }}
              components={{
                pre: CodeBlock,
                MermaidDiagram,
                table: (props) => (
                  <div className="table-scroll">
                    <table {...props} />
                  </div>
                ),
              }}
            />
          </div>
          <div className="post-tags">
            <span>برچسب‌ها:</span>
            {a.tags.map((t) => (
              <Link key={t} href={`/articles/?tag=${encodeURIComponent(t)}`}>
                {t}
              </Link>
            ))}
          </div>
          <nav className="post-adjacent" aria-label="نوشته‌های دیگر">
            {all[index + 1] ? (
              <Link href={`/articles/${all[index + 1].slug}/`}>
                <ArrowRight size={17} />
                <div>
                  <span>نوشته‌ی بعدی</span>
                  <p>{all[index + 1].title}</p>
                </div>
              </Link>
            ) : (
              <span />
            )}
            {all[index - 1] ? (
              <Link href={`/articles/${all[index - 1].slug}/`}>
                <div>
                  <span>نوشته‌ی قبلی</span>
                  <p>{all[index - 1].title}</p>
                </div>
                <ArrowLeft size={17} />
              </Link>
            ) : (
              <Link href="/articles/">
                <div>
                  <span>ادامه‌ی مطالعه</span>
                  <p>بازگشت به همه‌ی نوشته‌ها</p>
                </div>
                <ArrowLeft size={17} />
              </Link>
            )}
          </nav>
        </article>
        <aside className="post-sidebar" aria-label="راهنمای مطالعه">
          <Link className="post-back" href="/articles/">
            بازگشت به نوشته‌ها <ArrowLeft size={13} />
          </Link>
          {headings.length > 0 && (
            <nav className="post-toc" aria-label="فهرست مطالب">
              <h2>فهرست مطالب</h2>
              <ol>
                {headings.map((h) => (
                  <li className={h.depth === 3 ? "nested" : ""} key={h.id}>
                    <a href={`#${h.id}`}>{h.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="post-reflection">
            <svg viewBox="0 0 60 38" fill="none" aria-hidden="true">
              <path
                d="m3 24 16-15 16 15M19 20 33 6l20 19M7 31h22m-11 6h10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <p>
              «معماری خوب،
              <br />
              آرامش را به سیستم
              <br />و تیم می‌آورد.»
            </p>
          </div>
          {related.length > 0 && (
            <section className="post-related">
              <h2>مطالب مرتبط</h2>
              {related.map((r, i) => (
                <article key={r.slug}>
                  <div>
                    <h3>
                      <Link href={`/articles/${r.slug}/`}>{r.title}</Link>
                    </h3>
                    <CategoryLabel slug={r.category} />
                    <div className="post-related-meta">
                      <time dateTime={r.date}>{dateFa(r.date)}</time>
                      <span>·</span>
                      <span>
                        {r.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/articles/${r.slug}/`}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={articleThumbnail(
                        r.slug,
                        `/images/${["stones", "notebook", "vase"][i % 3]}.webp`,
                      )}
                      alt=""
                      width={66}
                      height={66}
                      loading="lazy"
                    />
                  </Link>
                </article>
              ))}
            </section>
          )}
        </aside>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
