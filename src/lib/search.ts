export type SearchArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
  text: string;
};
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[۰-۹٠-٩]/g, (c) =>
      String(
        c.charCodeAt(0) >= 1776
          ? c.charCodeAt(0) - 1776
          : c.charCodeAt(0) - 1632,
      ),
    )
    .replace(/[\u200c\u200d\s]+/g, " ")
    .trim();
}
export function filterArticles(
  articles: SearchArticle[],
  query = "",
  category = "",
  tag = "",
) {
  const words = normalize(query).split(" ").filter(Boolean);
  return articles.filter(
    (a) =>
      (!category || a.category === category) &&
      (!tag || a.tags.includes(tag)) &&
      words.every((w) =>
        normalize(
          `${a.title} ${a.description} ${a.tags.join(" ")} ${a.text}`,
        ).includes(w),
      ),
  );
}
