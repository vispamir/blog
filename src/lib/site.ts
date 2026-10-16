export const site = {
  name: "امیر کولیوند",
  title: "یادداشت‌های امیر کولیوند",
  description:
    "یادداشت‌هایی درباره‌ی مهندسی نرم‌افزار، بازار کار و ایده‌های کسب‌وکار",
  url: process.env.SITE_URL?.replace(/\/$/, ""),
};
if (site.url) {
  const parsed = new URL(site.url);
  if (
    !["http:", "https:"].includes(parsed.protocol) ||
    parsed.origin !== site.url
  )
    throw new Error(
      "SITE_URL must be an HTTP(S) origin without a path, query, or credentials",
    );
}
export function absolute(path: string) {
  return site.url ? `${site.url}${path}` : undefined;
}
