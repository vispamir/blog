import { ArticleExplorer } from "@/components/ArticleExplorer";
import { searchIndex } from "@/lib/articles";
import { absolute } from "@/lib/site";
export const metadata = {
  title: "جست‌وجو",
  alternates: { canonical: absolute("/search/") },
};
export default function Search() {
  return (
    <div className="shell page">
      <p className="eyebrow">پیدا کردن یک فکر</p>
      <h1>جست‌وجو در نوشته‌ها</h1>
      <p className="page-intro">یک موضوع، واژه یا پرسش را جست‌وجو کنید.</p>
      <ArticleExplorer articles={searchIndex()} searchOnly />
    </div>
  );
}
