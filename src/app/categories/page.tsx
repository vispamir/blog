import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { categories } from "@/lib/categories";
import { getArticles } from "@/lib/articles";
import { absolute } from "@/lib/site";
export const metadata = {
  title: "دسته‌بندی‌ها",
  alternates: { canonical: absolute("/categories/") },
};
export default function Categories() {
  const all = getArticles();
  return (
    <div className="shell page">
      <p className="eyebrow">موضوع‌های این دفتر</p>
      <h1>دسته‌بندی‌ها</h1>
      <p className="page-intro">
        سه دریچه برای نگاه کردن به دنیای ساختن و کار کردن.
      </p>
      <div className="category-grid categories-page">
        {categories.map((c) => (
          <Link
            className={`category-block ${c.color}`}
            key={c.slug}
            href={`/categories/${c.slug}/`}
          >
            <span className="category-number">{c.number} /</span>
            <h2>{c.title}</h2>
            <p>{c.description}</p>
            <span className="category-bottom">
              {all
                .filter((a) => a.category === c.slug)
                .length.toLocaleString("fa-IR")}{" "}
              نوشته <ArrowLeft size={18} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
