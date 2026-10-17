import fs from "node:fs";
import path from "node:path";
import { getArticles } from "../src/lib/articles";
import { categoryBySlug } from "../src/lib/categories";
import { articleThumbnail } from "../src/lib/article-images";
const dir = path.join(process.cwd(), ".cache/share-card-preview");
fs.mkdirSync(dir, { recursive: true });
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const logo =
  '<svg viewBox="0 0 70 40" fill="none"><path d="m3 33 19-20 19 20M21 28 41 7l26 26" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const cards = getArticles(false).map((a) => {
  const c = categoryBySlug(a.category)!;
  const img = articleThumbnail(a.slug, "/images/stones.webp");
  const file = path.join(dir, `${a.slug}.html`);
  fs.writeFileSync(
    file,
    `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>${escape(a.title)}</title><style>
@font-face{font-family:Vazirmatn;src:url('/arabic.woff2') format('woff2');font-weight:100 900;font-display:block}@font-face{font-family:Vazirmatn;src:url('/latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-024F;font-display:block}*{box-sizing:border-box}html,body{margin:0;width:1200px;height:800px;overflow:hidden}body{font-family:Vazirmatn,sans-serif;color:#28383e;background:#f4f2eb}.photo{position:absolute;right:0;top:0;width:650px;height:800px;object-fit:cover;object-position:${["software-architecture", "technical-leadership"].includes(a.slug) ? "left" : ["payment-infrastructure", "engineering-interview"].includes(a.slug) ? "right" : "center"} center}.paper{position:absolute;inset:0 auto 0 0;width:678px;background:linear-gradient(110deg,#f6f4ed,#f2f0e8);clip-path:polygon(0 0,100% 0,85% 100%,0 100%)}.brand{position:absolute;left:66px;top:35px;display:flex;align-items:center;gap:30px;direction:ltr;font-size:25px;font-weight:700}.brand svg{width:67px;height:40px}.copy{position:absolute;left:70px;top:160px;width:470px;text-align:right}.category{display:flex;align-items:center;gap:18px;color:${c.color === "blue" ? "#587889" : c.color === "orange" ? "#9c7557" : "#4e7863"};font-size:22px;font-weight:600;direction:rtl}.category:before{content:'';width:76px;height:1px;background:#a7b7aa;opacity:.7}h1{font-size:${a.title.length > 68 ? 38 : a.title.length > 51 ? 42 : 48}px;line-height:1.65;font-weight:750;margin:30px 0 22px;letter-spacing:-.8px}p{font-size:23px;line-height:1.9;color:#748080;margin:0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.bottom{position:absolute;left:70px;bottom:49px;width:455px;display:flex;align-items:flex-end;justify-content:space-between;direction:ltr}.domain{font-size:22px;font-weight:600;letter-spacing:.5px;color:#416956}.cta{display:block;font-size:12px;direction:rtl;letter-spacing:0;color:#7a847e;font-weight:400;margin-bottom:4px}.reading{font-size:15px;direction:rtl;color:#788780;display:flex;gap:9px;align-items:center}.reading svg{width:23px;height:23px}.wash{position:absolute;left:0;bottom:0;width:340px;height:170px;opacity:.08}
</style></head><body><img class="photo" src="${img}" alt=""><div class="paper"></div><div class="brand">${logo}<span>امیر کولیوند</span></div><div class="copy"><div class="category">${escape(c.title)}</div><h1>${escape(a.title)}</h1><p>${escape(a.description)}</p></div><svg class="wash" viewBox="0 0 340 170"><path d="M0 120 73 55 122 99 182 38 260 103 299 80 340 127V170H0Z" fill="#637e6c"/><path d="m0 151 81-51 79 42 61-43 119 59v12H0Z" fill="#718478"/></svg><div class="bottom"><div class="domain"><span class="cta">ادامه‌ی نوشته در بلاگ</span>koulivand.ir</div><div class="reading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>${a.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</div></div><script>document.fonts.ready.then(()=>{const h=document.querySelector('h1');while(h.offsetHeight>265&&parseFloat(getComputedStyle(h).fontSize)>32){h.style.fontSize=(parseFloat(getComputedStyle(h).fontSize)-1)+'px'}document.body.dataset.ready='true'})</script></body></html>`,
  );
  return {
    slug: a.slug,
    title: a.title,
    articleUrl: `https://koulivand.ir/articles/${a.slug}/`,
    image: `/share-cards/${a.slug}.jpg`,
    width: 1200,
    height: 800,
  };
});
for (const [name, src] of [
  ["arabic", "arabic"],
  ["latin", "latin"],
])
  fs.copyFileSync(
    `node_modules/@fontsource-variable/vazirmatn/files/vazirmatn-${src}-wght-normal.woff2`,
    path.join(dir, `${name}.woff2`),
  );
fs.cpSync("public/images", path.join(dir, "images"), { recursive: true });
fs.writeFileSync(
  "public/share-cards/index.json",
  JSON.stringify(cards, null, 2) + "\n",
);
console.log(
  JSON.stringify({ previewDirectory: dir, cards: cards.map((c) => c.slug) }),
);
