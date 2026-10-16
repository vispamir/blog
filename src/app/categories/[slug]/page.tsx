import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "@/lib/categories";
import { getArticles } from "@/lib/articles";
import { ArticleList } from "@/components/ArticleList";
import { absolute } from "@/lib/site";
export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  return {
    title: c?.title,
    description: c?.description,
    alternates: { canonical: absolute(`/categories/${slug}/`) },
  };
}
export default async function Category({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();
  const articles = getArticles().filter((a) => a.category === slug);
  return (
    <div className="shell page">
      <p className={`eyebrow ${c.color}`}>موضوع {c.number}</p>
      <h1>{c.title}</h1>
      <p className="page-intro">{c.description}</p>
      <p className="result-count">
        {articles.length.toLocaleString("fa-IR")} نوشته
      </p>
      <ArticleList headingLevel={2} articles={articles} thumbnails />
    </div>
  );
}
