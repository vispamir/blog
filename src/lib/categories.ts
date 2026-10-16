export const categories = [
  {
    slug: "software-engineering",
    title: "مهندسی نرم‌افزار",
    description: "از نوشتن کد تا ساختن سیستم‌هایی که دوام می‌آورند.",
    color: "green",
    number: "۰۱",
  },
  {
    slug: "job-market",
    title: "بازار کار",
    description: "درباره‌ی مسیر حرفه‌ای، یادگیری و کار کردن با آدم‌ها.",
    color: "blue",
    number: "۰۲",
  },
  {
    slug: "business-ideas",
    title: "ایده‌های کسب‌وکار",
    description: "از یک پرسش ساده تا محصولی که مسئله‌ای را حل می‌کند.",
    color: "orange",
    number: "۰۳",
  },
] as const;
export type CategorySlug = (typeof categories)[number]["slug"];
export function categoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}
