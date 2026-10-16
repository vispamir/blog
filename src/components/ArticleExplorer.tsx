"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { filterArticles, type SearchArticle } from "@/lib/search";
import { categories } from "@/lib/categories";
import { ArticleList } from "./ArticleList";
export function ArticleExplorer({
  articles,
  searchOnly = false,
}: {
  articles: SearchArticle[];
  searchOnly?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQuery(p.get("q") ?? "");
    setTag(p.get("tag") ?? "");
    setCategory(p.get("category") ?? "");
  }, []);
  const results = useMemo(
    () => filterArticles(articles, query, category, tag),
    [articles, query, category, tag],
  );
  const tags = [...new Set(articles.flatMap((a) => a.tags))].sort();
  return (
    <>
      <div className="filters">
        <label className="search-field">
          <Search size={20} />
          <span className="sr-only">جست‌وجو در نوشته‌ها</span>
          <input
            autoFocus={searchOnly}
            type="search"
            placeholder="دنبال چه چیزی می‌گردید؟"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="filter-selects">
          <label>
            دسته‌بندی
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">همه‌ی موضوع‌ها</option>
              {categories.map((c) => (
                <option value={c.slug} key={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            برچسب
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              <option value="">همه‌ی برچسب‌ها</option>
              {tags.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          {(query || category || tag) && (
            <button
              className="clear-filters"
              onClick={() => {
                setQuery("");
                setCategory("");
                setTag("");
                window.history.replaceState(null, "", window.location.pathname);
              }}
            >
              <X size={15} />
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </div>
      <p className="result-count" role="status" aria-live="polite">
        {results.length.toLocaleString("fa-IR")} نوشته
      </p>
      {results.length ? (
        <ArticleList headingLevel={2} articles={results} thumbnails />
      ) : (
        <div className="empty">
          <h2>نوشته‌ای پیدا نشد</h2>
          <p>عبارت دیگری را امتحان کنید یا فیلترها را پاک کنید.</p>
        </div>
      )}
    </>
  );
}
