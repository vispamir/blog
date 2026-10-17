import type { Article } from "./articles";
export function embedOptions(params: URLSearchParams) {
  const layout = params.get("layout")?.toLowerCase();
  return {
    theme: params.get("theme")?.toLowerCase() === "dark" ? "dark" : "light",
    layout:
      layout === "horizontal" || layout === "horizental"
        ? "horizontal"
        : "vertical",
    id: (params.get("id") ?? "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 80),
  };
}
export function escapeHtml(text: string) {
  return text.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
type EmbedArticle = Pick<
  Article,
  "slug" | "title" | "description" | "date" | "readingTime"
>;
export function renderEmbed(
  article: EmbedArticle | undefined,
  image: string,
  category: string,
  options: ReturnType<typeof embedOptions>,
  nonce: string,
) {
  const e = escapeHtml;
  const date = article
    ? new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(article.date))
    : "";
  return `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>آخرین نوشته‌ی امیر کولیوند</title><style>
@font-face{font-family:Vazirmatn;src:url('/fonts/vazirmatn-arabic.woff2') format('woff2');font-weight:100 900;font-display:swap}@font-face{font-family:Vazirmatn;src:url('/fonts/vazirmatn-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-024F;font-display:swap}
*{box-sizing:border-box}html,body{margin:0;padding:0}body{font-family:Vazirmatn,sans-serif;font-size:14px;line-height:1.9;background:transparent;color:var(--ink)}body.light{--bg:#f7f5ef;--ink:#283638;--muted:#63716a;--border:#dedfd3;--accent:#486b52}body.dark{--bg:#222b29;--ink:#eef1e8;--muted:#b6c4b8;--border:#46544b;--accent:#b5d4b6}.widget{background:var(--bg);border:1px solid var(--border);border-radius:6px;overflow:hidden;margin:0 auto;max-width:520px}.widget.horizontal{max-width:960px;display:grid;grid-template-columns:35% minmax(0,1fr)}a{color:inherit;text-decoration:none}a:focus-visible{outline:2px solid var(--accent);outline-offset:-4px}.photo{display:block;background:var(--border)}.photo img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.horizontal .photo img{height:100%;min-height:220px;aspect-ratio:auto}.content{padding:20px 22px;min-width:0}.byline{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px;color:var(--muted);margin-bottom:12px}.byline a{display:flex;align-items:center;gap:7px}.byline svg{width:22px;height:18px;flex-shrink:0}.category{color:var(--accent);font-size:10px}h1{font-size:20px;line-height:1.8;font-weight:650;margin:0 0 9px;overflow-wrap:anywhere}h1 a:hover{color:var(--accent)}.description{color:var(--muted);font-size:12px;line-height:2;margin:0 0 16px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.meta{font-size:10px;color:var(--muted);display:flex;gap:9px;flex-wrap:wrap}.read-more{font-size:12px;color:var(--accent);display:inline-flex;align-items:center;gap:9px;margin-top:15px}.empty{padding:25px;text-align:center}.horizontal .content{padding:19px 23px}@media(max-width:480px){.widget.horizontal{display:block}.horizontal .photo img{height:auto;min-height:0;aspect-ratio:16/9}.content,.horizontal .content{padding:16px 18px}h1{font-size:18px}}
</style></head><body class="${options.theme}"><article class="widget ${options.layout}" id="widget">${
    article
      ? `
<a class="photo" href="/articles/${e(article.slug)}/" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true"><img src="${e(image)}" width="672" height="378" alt=""></a><div class="content"><div class="byline"><a href="/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 47 30" fill="none" aria-hidden="true"><path d="m2 23 12-13 12 13M13 20 29 6l16 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>امیر کولیوند</a><span class="category">${e(category)}</span></div><h1><a href="/articles/${e(article.slug)}/" target="_blank" rel="noopener noreferrer">${e(article.title)}</a></h1><p class="description">${e(article.description)}</p><div class="meta"><time datetime="${e(article.date)}">${e(date)}</time><span>·</span><span>${article.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span></div><a class="read-more" href="/articles/${e(article.slug)}/" target="_blank" rel="noopener noreferrer">خواندن نوشته <span aria-hidden="true">←</span></a></div>`
      : '<div class="empty">هنوز نوشته‌ای منتشر نشده است.</div>'
  }</article><script nonce="${e(nonce)}">(function(){var root=document.getElementById('widget');var last=0;function resize(){var height=Math.ceil(root.getBoundingClientRect().height);if(height!==last){last=height;parent.postMessage({type:'koulivand:resize',id:${JSON.stringify(options.id)},height:height},'*');}}if(window.ResizeObserver){new ResizeObserver(resize).observe(root);}window.addEventListener('load',resize);window.addEventListener('resize',resize);if(document.fonts){document.fonts.ready.then(resize);}resize();})();</script></body></html>`;
}
