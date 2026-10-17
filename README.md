# یادداشت‌های امیر کولیوند

A Persian, RTL personal blog using Next.js App Router, strict TypeScript, Tailwind CSS and local MDX. No backend, database, external CMS or runtime API calls. The included articles are editable sample writing, not claims about the author's experience.

## Run locally

Use Node.js 22.13+ (Node.js 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

`npm run build` writes a standalone Next.js server. `npm run preview` serves it with `next start`.

## Add or edit an article

Create a trusted, local `.mdx` file under `content/articles/`. MDX can execute code during build: do not load untrusted submissions.

```yaml
---
title: "عنوان فارسی"
description: "خلاصه‌ی کوتاه و روشن"
slug: "my-new-article"
category: "software-engineering"
date: "2026-10-17"
updatedAt: "2026-10-18"
tags: ["طراحی سیستم"]
featured: false
draft: false
---
```

Required fields: title, description, slug, category and date. Quote ISO dates. Slugs must be unique lowercase Latin words separated by hyphens. Categories: `software-engineering`, `job-market`, `business-ideas`. Optional fields: `updatedAt`, positive integer `readingTime`, tags, featured, draft and a local `cover` path under `/images/`. Reading time is calculated at 180 words/minute when omitted. Invalid metadata and duplicate slugs fail the build. Drafts appear in development and are excluded from production.

Use H2/H3 headings for the automatic table of contents. Markdown tables, lists, blockquotes and fenced code blocks are supported. Use an explicit code language such as `typescript`. Highlighting runs at build time; only the copy control needs browser JavaScript. Put local images in `public/images/`, pre-optimize them and provide meaningful alt text. The homepage uses locally bundled, generated Zen photography optimized as WebP. Vazirmatn is bundled through Fontsource and its OFL license is included in `public/fonts-LICENSE.txt`.

## Edit identity and design

- Site identity and URL: `src/lib/site.ts`.
- About content: `src/app/about/page.tsx`; replace the contact placeholder with your real email/social links.
- Category names and descriptions: `src/lib/categories.ts`.
- Design tokens and responsive styles: `src/app/globals.css`.

The initial release uses a light theme. No theme, newsletter, comments or contact-submission controls are present.

## Search

`/articles/` and `/search/` share a local index of metadata and stripped article text. Search matches all query words across title, description, tags and text, normalizing Arabic/Persian letters, diacritics, numerals and half-spaces. Category and tag filters combine with search. Direct tag links use `/articles/?tag=...`. Raw MDX is never passed to the search client. Six sample articles keep this index small; consider lazy-loading a JSON index as the collection grows.

## Publish

The public origin is `https://koulivand.ir`. Set `SITE_URL` to that origin before building, for example in a local `.env.production` file. When unset, canonical URLs, sitemap entries and the robots sitemap reference are omitted. Rebuild after changing content or URL.

Pushes to `main` run `.github/workflows/deploy.yml`. The workflow tests and typechecks, then builds the image `koulivand/blog` on the modeno server. Watchtower, already running with `--label-enable --no-pull`, replaces the `koulivand-blog` container when that local production tag changes. The repository secrets `MODENO_HOST` and `MODENO_SSH_KEY` are required.

The container runs Next.js on port 3000 and publishes it at `127.0.0.1:18084` on the server. The server Nginx proxies `koulivand.ir` and `www.koulivand.ir` to that process. The app container does not run Nginx.

Routes use trailing slashes. Unknown paths are the Next.js 404 page.

For GitHub Pages add an empty `.nojekyll` file to the uploaded artifact. GitHub project subpaths are not configured: a subpath deployment also requires configuring Next.js `basePath` and prefixing public asset URLs consistently. Use a root/custom-domain deployment with this configuration.

## Checks

`npm test` covers metadata, reading-time fallback, ordering, related articles, normalization and combined search. `npm run typecheck` checks TypeScript. The production build statically renders every article/category and generates `sitemap.xml`, `robots.txt` and the custom 404. Verify keyboard navigation and small-screen layout before publication.

### Verification performed

Production export, TypeScript and six content/search tests passed. The latest export inspection verified 17 HTML documents and 598 local route/asset references. Browser checks at the available narrow viewport covered Persian/Arabic search normalization, empty state, clearing filters, tag/category controls, mobile menu, article heading anchors and successful code copying. The reference-led redesign was also visually inspected at 1224 × 1285 and 390 × 844; the mobile view had no horizontal overflow. Set the real `SITE_URL` before publishing; publication has not been performed.

The article detail redesign was checked at 1024px desktop and 390px mobile widths. The exported page loaded the local cover, copied code successfully, followed heading anchors, and opened the mobile table of contents without horizontal overflow. Article cover imagery is locally generated and compressed to WebP.

### Mermaid diagrams

Use a fenced `mermaid` block in article MDX (optionally with `title="..."`). Diagrams are pre-rendered as local SVG and included directly in the generated HTML: no browser JavaScript, loading placeholder, or source disclosure is needed. Wide diagrams scroll inside their frame on mobile.

The renderer uses the first 16 hex digits of the SHA-256 of the exact fence body to locate `public/images/diagrams/mermaid-<hash>.svg`. When changing a diagram, export the updated source as SVG using Mermaid and save it at the new hash path (the build reports the expected path if missing). Only commit SVG exported from trusted local source. This prevents stale images from silently disagreeing with edited Mermaid text. Mermaid is a development dependency, not part of the browser bundle.

## LinkedIn share cards

`public/share-cards/` contains one 1200×800 JPG for each published article. `index.json` maps cards to article URLs. Article Open Graph and Twitter metadata use these images, so sharing an article URL also exposes its card to social crawlers.

The editable layout is in `scripts/prepare-share-cards.ts`. Run `npx tsx scripts/prepare-share-cards.ts` to prepare six local HTML previews under `.cache/share-card-preview/` and refresh the manifest. Serve that directory locally and render each preview at exactly 1200×800 after fonts/images load; save each capture as `public/share-cards/<slug>.jpg`. Regenerate after title, description, category, photo or reading-time changes. The preview directory is excluded from Git and Docker builds.

## Embed the latest article on another website

Place this snippet in the host page's body where the widget should appear:

```html
<script
  async
  src="https://koulivand.ir/embed.js"
  data-theme="light"
  data-layout="vertical"
></script>
```

`data-theme` accepts `light` (default) or `dark`. `data-layout` accepts `vertical` (default), `horizontal`, or the equivalent `horizental` spelling. Attribute values take precedence over script URL query options:

```html
<script async src="https://koulivand.ir/embed.js?theme=dark&layout=horizental"></script>
```

For JavaScript initialization, load the script with `data-auto="false"`, then call its API after it loads:

```html
<div id="latest-post"></div>
<script src="https://koulivand.ir/embed.js" data-auto="false"></script>
<script>
  const widget = KoulivandEmbed.mount('#latest-post', {
    theme: 'dark',
    layout: 'horizontal'
  });
  // When removing a dynamically mounted widget:
  // widget.destroy();
</script>
```

The iframe-only content page can also be viewed directly at `/embed/?theme=dark&layout=horizontal`. It has no blog header/footer, uses bundled fonts and images, excludes drafts even in development, and selects the newest publication date (not last edit date). Content updates after new articles are deployed and the host page/iframe reloads; no polling is performed. Horizontal cards stack at narrow widths.

The loader derives the blog origin from its own script URL, supports multiple widgets, validates resize messages against the iframe's origin and window, and adjusts height after image/font loading. Article links open in a new tab. No third-party service or API key is needed. Hosts with Content Security Policy must allow `https://koulivand.ir` in `script-src` and `frame-src`; a fixed host container height can still clip any embed. `/embed/` is intentionally frameable and marked noindex; it is served without caching to keep its article choice fresh. It is a small HTML route handler, not a React page, so it does not load the blog shell or framework bundles.

### هماهنگی embed با سایت میزبان

`embed.js` رنگ پس‌زمینه، متن و لینک را از بلوک میزبان و والدهای آن می‌گیرد؛ بنابراین تطبیق با سایت میزبان بر رنگ‌های پیش‌فرض `light` و `dark` اولویت دارد. تغییر کلاس یا استایل والدها و اندازه بلوک نیز دنبال می‌شود. عرض کارت تمام فضای بلوک را می‌گیرد و در عرض کم، چیدمان افقی به عمودی تبدیل می‌شود.

برای ارتفاع خودکار، بلوک را بدون ارتفاع مشخص قرار دهید. برای فضای با ارتفاع مشخص، از mount در یک بلوک خالی با ارتفاع CSS استفاده کنید:

```html
<div id="latest-post" style="width:100%;height:360px"></div>
<script src="https://koulivand.ir/embed.js" data-auto="false"></script>
<script>
  KoulivandEmbed.mount('#latest-post', {layout:'horizontal'});
</script>
```

در بلوک دارای ارتفاع مشخص، محتوا در همان فضا قرار می‌گیرد و در صورت کمبود فضا قسمت متن قابل پیمایش است. گزینه `height: 'auto'` ارتفاع را همیشه بر اساس محتوا تنظیم می‌کند. لینک مستقیم `/embed/` بدون loader همچنان از تم انتخابی استفاده می‌کند. اسکریپت تنها رنگ‌ها و نام فونت محاسبه‌شده و اندازه بلوک را به iframe می‌فرستد.
