import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { categoryBySlug, type CategorySlug } from "./categories";
import type { SearchArticle } from "./search";
export type Article = Omit<SearchArticle, "text" | "category"> & {
  category: CategorySlug;
  content: string;
  updatedAt?: string;
  cover?: string;
  draft: boolean;
};
const dir = path.join(process.cwd(), "content/articles");
export function plainText(content: string) {
  return content
    .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/!?(\[([^\]]*)\])\([^)]*\)/g, "$2")
    .replace(/[#*`_>|{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function validDate(value: unknown) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function parseArticle(raw: string, filename: string): Article {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${filename}: Missing frontmatter`);
  const d = parse(match[1]) as Record<string, any>;
  const content = match[2];
  if (!d || typeof d !== "object" || Array.isArray(d))
    throw new Error(`${filename}: Invalid frontmatter`);
  const fail = (message: string): never => {
    throw new Error(`${filename}: ${message}`);
  };
  for (const key of ["title", "description", "slug", "category", "date"])
    if (typeof d[key] !== "string" || !d[key].trim())
      fail(`Missing or invalid ${key}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) fail("Invalid slug");
  if (!categoryBySlug(d.category)) fail("Unknown category");
  if (
    !validDate(d.date) ||
    (d.updatedAt !== undefined && !validDate(d.updatedAt))
  )
    fail("Invalid date");
  if (d.updatedAt && d.updatedAt < d.date)
    fail("updatedAt precedes publication");
  if (
    d.tags !== undefined &&
    (!Array.isArray(d.tags) ||
      d.tags.some((t: unknown) => typeof t !== "string" || !t.trim()))
  )
    fail("Invalid tags");
  for (const k of ["featured", "draft"])
    if (d[k] !== undefined && typeof d[k] !== "boolean") fail(`Invalid ${k}`);
  if (
    d.readingTime !== undefined &&
    (!Number.isInteger(d.readingTime) || d.readingTime < 1)
  )
    fail("Invalid readingTime");
  if (
    d.cover !== undefined &&
    (typeof d.cover !== "string" ||
      !d.cover.startsWith("/images/") ||
      d.cover.includes("..") ||
      !fs.existsSync(path.join(process.cwd(), "public", d.cover)))
  )
    fail("Invalid local cover");
  if (!content.trim()) fail("Empty article");
  return {
    title: d.title,
    description: d.description,
    slug: d.slug,
    category: d.category,
    date: d.date,
    updatedAt: d.updatedAt,
    tags: d.tags ?? [],
    featured: d.featured ?? false,
    draft: d.draft ?? false,
    cover: d.cover,
    readingTime:
      d.readingTime ??
      Math.max(1, Math.ceil(plainText(content).split(/\s+/).length / 180)),
    content,
  };
}
export function getArticles(
  includeDrafts = process.env.NODE_ENV !== "production",
) {
  const all = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => parseArticle(fs.readFileSync(path.join(dir, f), "utf8"), f));
  return prepareArticles(all, includeDrafts);
}
export function prepareArticles(all: Article[], includeDrafts: boolean) {
  const seen = new Set<string>();
  for (const a of all) {
    if (seen.has(a.slug)) throw new Error(`Duplicate article slug: ${a.slug}`);
    seen.add(a.slug);
  }
  return all
    .filter((a) => includeDrafts || !a.draft)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    );
}
export function getArticle(slug: string) {
  return getArticles().find((a) => a.slug === slug);
}
export function relatedArticles(article: Article, all = getArticles()) {
  return all
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      a,
      score:
        (a.category === article.category ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.a.date.localeCompare(a.a.date))
    .slice(0, 3)
    .map((x) => x.a);
}
export function searchIndex() {
  return getArticles().map(({ content, draft, cover, updatedAt, ...a }) => ({
    ...a,
    text: plainText(content),
  }));
}
export function dateFa(date: string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
