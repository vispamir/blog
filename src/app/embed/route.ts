import { randomBytes } from "node:crypto";
import { getArticles } from "@/lib/articles";
import { articleThumbnail } from "@/lib/article-images";
import { categoryBySlug } from "@/lib/categories";
import { embedOptions, renderEmbed } from "@/lib/embed";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  const options = embedOptions(new URL(request.url).searchParams);
  const article = getArticles(false)[0];
  const nonce = randomBytes(16).toString("base64");
  return new Response(
    renderEmbed(
      article,
      article ? articleThumbnail(article.slug, "/images/stones.webp") : "",
      article ? categoryBySlug(article.category)!.title : "",
      options,
      nonce,
    ),
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "Content-Security-Policy": `default-src 'none'; img-src 'self'; font-src 'self'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; frame-ancestors *; base-uri 'none'; form-action 'none'`,
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
