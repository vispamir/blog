import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    ...["/", "/articles/", "/categories/", "/about/", "/search/"].map((p) => ({
      url: `${site.url}${p}`,
    })),
    ...categories.map((c) => ({ url: `${site.url}/categories/${c.slug}/` })),
    ...getArticles().map((a) => ({
      url: `${site.url}/articles/${a.slug}/`,
      lastModified: a.updatedAt ?? a.date,
    })),
  ];
}
