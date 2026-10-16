import Link from "next/link";
import { ArrowLeft, FileText, List, UserRound } from "lucide-react";
import { getArticles } from "@/lib/articles";
import { categories } from "@/lib/categories";
import { ArticleList } from "@/components/ArticleList";
import { absolute } from "@/lib/site";
export const metadata = { alternates: { canonical: absolute("/") } };
export default function Home() {
  const articles = getArticles();
  return (
    <div className="zen-home">
      <section className="zen-hero" aria-labelledby="hero-heading">
        <div className="zen-hero-inner shell">
          <div className="zen-hero-copy">
            <h1 id="hero-heading">
              یادداشت‌هایی درباره‌ی
              <br />
              فناوری، کار و ایده‌ها
            </h1>
            <p>
              اینجا درباره‌ی مهندسی نرم‌افزار، بازار کار
              <br className="hero-desktop-break" /> و ایده‌های کسب‌وکار
              می‌نویسم؛
              <br className="hero-desktop-break" /> شاید چیزهایی پیدا کنیم که به
              کارمان بیایند.
            </p>
          </div>
        </div>
      </section>
      <div className="shell zen-columns">
        <section className="zen-writing" aria-labelledby="latest-title">
          <div className="zen-section-title">
            <FileText size={21} strokeWidth={1.7} />
            <h2 id="latest-title">
              <Link href="/articles/">آخرین نوشته‌ها</Link>
            </h2>
          </div>
          <ArticleList articles={articles.slice(0, 4)} thumbnails />
        </section>
        <aside className="zen-sidebar" aria-label="درباره‌ی وبلاگ">
          <section className="zen-sidebar-section">
            <div className="zen-section-title">
              <List size={21} strokeWidth={1.7} />
              <h2>
                <Link href="/categories/">دسته‌بندی‌ها</Link>
              </h2>
            </div>
            <ul className="zen-category-list">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}/`}>
                    <span className={`zen-dot ${c.color}`} />
                    <span>{c.title}</span>
                    <span className="zen-category-count">
                      (
                      {articles
                        .filter((a) => a.category === c.slug)
                        .length.toLocaleString("fa-IR")}
                      )
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section className="zen-sidebar-section zen-bio">
            <div className="zen-section-title">
              <UserRound size={21} strokeWidth={1.7} />
              <h2>درباره من</h2>
            </div>
            <p>
              من امیر کولیوند هستم؛
              <br />
              این‌جا درباره‌ی مهندسی نرم‌افزار، ساختن محصولات مفید، یادگیری
              مداوم و پیدا کردن فرصت‌های بهتر می‌نویسم.
            </p>
            <Link href="/about/" className="zen-read-more">
              بیشتر بخوانید <ArrowLeft size={14} />
            </Link>
          </section>
          <section
            className="zen-sidebar-section zen-quote"
            aria-label="کمی تأمل"
          >
            <span className="zen-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>
              «بهترین زمان برای شروع،
              <br />
              هنوز نیامده.»
            </blockquote>
            <p className="zen-quote-source">— ناشناس</p>
            <svg
              className="zen-ink-landscape"
              viewBox="0 0 250 130"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="149" cy="29" r="15" fill="#e7d3b6" />
              <path
                d="M20 87c29-2 42-11 67-30 6-5 10-8 16-3 16 18 30 29 65 34M49 86c22-7 40-24 49-32 3 12 9 24 27 31M64 84l32-27M77 82l22-23M102 60l17 25M33 91h68m26 0h51m-111 11h69m-43 11h61m-100 9h32m58-19h27m-1-17h21m-8-7h18"
                stroke="#5d6058"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M25 89c27-7 42-7 74-34"
                stroke="#5d6058"
                strokeWidth="2"
                opacity=".5"
              />
              <rect
                x="219"
                y="92"
                width="13"
                height="22"
                rx="1"
                stroke="#b76e5b"
              />
              <path
                d="M223 96h5m-6 4h6m-5 2v8m4-8v8m-5-3h6"
                stroke="#b76e5b"
                strokeWidth=".8"
              />
            </svg>
          </section>
        </aside>
      </div>
    </div>
  );
}
