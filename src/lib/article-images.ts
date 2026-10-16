const thumbnails: Record<string, string> = {
  "software-architecture": "/images/stones.webp",
  "technical-leadership": "/images/vase.webp",
  "payment-infrastructure": "/images/medieval-coin-market.webp",
  "validate-business-idea": "/images/samurai-merchant-report.webp",
  microservices: "/images/misty-japanese-city.webp",
  "engineering-interview": "/images/quiet-north-korean-street.webp",
};
export function articleThumbnail(slug: string, fallback: string) {
  return thumbnails[slug] ?? fallback;
}
