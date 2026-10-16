import { ArticleExplorer } from "@/components/ArticleExplorer";
import { searchIndex } from "@/lib/articles";
import { absolute } from "@/lib/site";
export const metadata = {
  title: "نوشته‌ها",
  description: "تمام یادداشت‌ها درباره‌ی فناوری، کار و ایده‌ها",
  alternates: { canonical: absolute("/articles/") },
};
export default function Articles() {
  return (
    <div className="shell page">
      <p className="eyebrow">دفتر یادداشت</p>
      <h1>همه‌ی نوشته‌ها</h1>
      <p className="page-intro">
        یادداشت‌هایی از میان تجربه‌ها، پرسش‌ها و چیزهایی که یاد می‌گیریم.
      </p>
      <ArticleExplorer articles={searchIndex()} />
    </div>
  );
}
