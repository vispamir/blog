import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getArticles,
  prepareArticles,
  parseArticle,
  relatedArticles,
  searchIndex,
} from "../src/lib/articles";
import { normalize, filterArticles } from "../src/lib/search";
const raw = (extra = "") =>
  `---\ntitle: "نمونه"\ndescription: "توضیح"\nslug: "sample"\ncategory: "software-engineering"\ndate: "2026-10-01"\n${extra}\n---\n## عنوان\nمتن نمونه برای خواندن`;
test("validates metadata and computes reading time", () => {
  assert.equal(parseArticle(raw(), "sample").readingTime, 1);
  for (const extra of [
    "readingTime: 0",
    'updatedAt: "2026-09-01"',
    "tags: [3]",
    'draft: "false"',
  ])
    assert.throws(() => parseArticle(raw(extra), "invalid"));
  assert.throws(() =>
    parseArticle(raw().replace("2026-10-01", "2026-02-30"), "invalid"),
  );
  assert.throws(() =>
    parseArticle(raw().replace("software-engineering", "unknown"), "invalid"),
  );
  assert.throws(() =>
    parseArticle(raw().replace("sample", "../bad"), "invalid"),
  );
});
test("sorts content and excludes drafts on request", () => {
  const all = getArticles(false);
  assert.equal(all.length, 6);
  assert.ok(all.every((a) => !a.draft));
  assert.deepEqual(
    all.map((a) => a.date),
    all
      .map((a) => a.date)
      .sort()
      .reverse(),
  );
  assert.equal(new Set(all.map((a) => a.slug)).size, all.length);
});
test("relates articles without self references", () => {
  const all = getArticles();
  const related = relatedArticles(all[0], all);
  assert.ok(related.length > 0);
  assert.ok(related.every((a) => a.slug !== all[0].slug));
  assert.equal(related[0].category, all[0].category);
});
test("normalizes Persian, Arabic, numerals and whitespace", () => {
  assert.equal(normalize("  كاري يک ۱۲٣\u200c۴ "), "کاری یک 123 4");
  assert.equal(normalize("کِتاب"), "کتاب");
});
test("searches content and combines category and tags", () => {
  const index = searchIndex();
  assert.ok(
    filterArticles(index, "idempotencyKey").some(
      (a) => a.slug === "microservices",
    ),
  );
  assert.equal(filterArticles(index, "", "job-market", "مسیر شغلی").length, 1);
  assert.equal(filterArticles(index, "ناموجودناموجود").length, 0);
  assert.ok(index.every((a) => !("content" in a)));
});

test("rejects duplicate slugs and filters drafts", () => {
  const article = parseArticle(raw(), "fixture");
  assert.throws(() => prepareArticles([article, article], false), /Duplicate/);
  const draft = { ...article, slug: "draft", draft: true };
  assert.deepEqual(prepareArticles([article, draft], false), [article]);
  assert.equal(prepareArticles([article, draft], true).length, 2);
});
