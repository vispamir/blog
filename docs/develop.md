# Build a Minimalist Persian Personal Blog with Next.js

## 1. Project Overview

Build a complete, production-ready Persian personal blog using **Next.js with the App Router**, TypeScript, and Tailwind CSS.

The website belongs to a software engineer and focuses on three main topics:

- Software Engineering
- Job Market and Career Development
- Business Ideas and Entrepreneurship

The design should be minimalist, calm, elegant, typography-focused, and inspired by Japanese Zen philosophy, Wabi-Sabi aesthetics, and natural materials.

**Important constraints:**
- No backend.
- No database.
- No authentication.
- No external CMS.
- No server-side API integrations.
- All blog content must be stored locally in the project.
- The website must be deployable as a static site.

The final result must be a fully functional website, not just a static mockup.

## 2. Technology Stack

Use the following technologies:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- React Server Components by default
- Lucide React for icons
- MDX for locally stored blog articles
- A suitable local MDX content loader compatible with static generation

Use stable, compatible package versions.

Avoid unnecessary dependencies and excessive client-side JavaScript.

Configure the project for static export using `output: 'export'` in `next.config.ts`.

All pages must be generated at build time. Do not depend on runtime server features, API routes, server actions, or dynamic backend services.

## 3. Visual Design and Art Direction

Create a sophisticated, understated design inspired by Japanese Zen interiors and editorial publications.

### Design principles

- Minimalism and visual restraint
- Generous whitespace
- Strong typographic hierarchy
- Calm, natural colors
- Subtle separators and borders
- Content-first layout
- No unnecessary animations or decorative elements
- No dashboard-style cards or excessive rounded containers

### Color palette

Use CSS variables for a consistent design system.

- Background: warm ivory `#F7F5EF`
- Secondary background: `#EEEAE1`
- Primary text: `#283638`
- Secondary text: `#77817D`
- Muted green: `#5F866C`
- Soft blue: `#68899A`
- Earthy orange: `#C18A62`
- Border: `#E2DED5`

Use these colors consistently throughout the website.

### Typography

The entire website must support Persian typography and right-to-left layouts.

Use a high-quality Persian font such as Vazirmatn, preferably self-hosted or bundled locally to avoid external runtime dependencies.

Typography requirements:

- Excellent readability for long Persian articles
- Comfortable line height
- Appropriate Persian punctuation and spacing
- Clear distinction between headings, paragraphs, metadata, and captions
- Support for Persian and Latin characters, numbers, and technical terminology

Use a readable article width of approximately 680–760px.

### Visual assets

Use subtle, carefully selected imagery inspired by:

- Japanese gardens
- Misty mountains
- Natural stones
- Handmade paper
- Minimal ceramic objects
- Wooden desks, notebooks, and coffee cups
- Plants and natural light

Images should be used sparingly. The blog must remain primarily text-oriented.

Prefer locally stored images or lightweight, optimized assets that work with static export.

Avoid generic startup illustrations, bright gradients, oversized shadows, excessive glassmorphism, and stock-photo-heavy layouts.

## 4. Global Layout

Build a consistent site shell shared across all pages.

### Header

Create a slim, elegant header with:

- A minimalist geometric mountain logo
- The author's Persian name: «امیر کولوند»
- Navigation links:
  - خانه
  - نوشته‌ها
  - دسته‌بندی‌ها
  - درباره من
- A search icon or compact search input
- An optional light/dark theme toggle

The header should be responsive and unobtrusive.

On desktop, keep the navigation horizontal. On mobile, use a compact accessible navigation menu.

### Footer

Include:

- Author name
- Copyright notice
- Links to the main sections
- Optional social links
- A subtle Japanese-inspired decorative element

Example:

«© ۱۴۰۵ امیر کولوند — ساخته‌شده با علاقه»

Keep the footer visually quiet.

## 5. Homepage

Create a complete homepage with the following sections.

### A. Hero Section

Use a spacious, editorial-style hero inspired by the supplied Japanese minimalist design.

Persian headline:

«یادداشت‌هایی درباره‌ی فناوری، کار و ایده‌ها»

Supporting text:

«اینجا درباره‌ی مهندسی نرم‌افزار، بازار کار و ایده‌های کسب‌وکار می‌نویسم؛ شاید چیزهایی پیدا کنیم که به کارمان بیایند.»

Place the text on one side and a restrained, natural visual composition on the other.

Avoid oversized marketing-style calls to action.

Include one subtle link:

«مشاهده‌ی نوشته‌ها ←»

### B. Latest Articles

Display the latest articles in a clean editorial list.

Each article entry should include:

- Category
- Article title
- Short excerpt
- Publication date
- Estimated reading time
- Optional thumbnail
- A link to the full article

Use horizontal separators instead of individual card backgrounds.

On desktop, show small thumbnails on the right and article content beside them, respecting RTL layout.

On mobile, prioritize title and excerpt readability.

### C. Category Overview

Introduce the three main categories:

1. مهندسی نرم‌افزار
2. بازار کار
3. ایده‌های کسب‌وکار

Each category should have a short description, a distinct muted accent color, and a link to its archive.

Keep this section compact.

### D. Selected Writing

Optionally include a small section for featured or pinned articles, controlled through local content metadata.

### E. About Preview

Show a short author introduction with a link to the complete About page.

## 6. Blog Article System

Implement a complete local article system using MDX files.

Suggested directory structure:

```text
content/
  articles/
    software-architecture.mdx
    engineering-career.mdx
    payment-platform-ideas.mdx

src/
  app/
    page.tsx
    layout.tsx
    not-found.tsx
    articles/
      page.tsx
      [slug]/
        page.tsx
    categories/
      page.tsx
      [slug]/
        page.tsx
    about/
      page.tsx
    search/
      page.tsx
  components/
    Header.tsx
    Footer.tsx
    ArticleList.tsx
    ArticleItem.tsx
    CategoryLabel.tsx
    SearchInput.tsx
    TableOfContents.tsx
    ReadingProgress.tsx
    ThemeToggle.tsx
  lib/
    articles.ts
    categories.ts
    search.ts
  styles/
    globals.css
  types/
    article.ts
  public/
    fonts/
    images/
```

Adapt the structure when necessary, but maintain clear separation between content, presentation, and utilities.

### Article metadata

Every MDX article should support frontmatter similar to:

```yaml
---
title: "معماری نرم‌افزار؛ از سرویس کوچک تا سیستم بزرگ"
description: "نگاهی عملی به تصمیم‌های معماری و رشد تدریجی سیستم‌ها."
slug: "software-architecture"
category: "software-engineering"
date: "2026-10-15"
updatedAt: "2026-10-16"
readingTime: 8
featured: true
tags:
  - معماری نرم‌افزار
  - طراحی سیستم
  - مهندسی بک‌اند
cover: "/images/software-architecture.jpg"
draft: false
---
```

Create TypeScript types and a content utility layer to:

- Load all local articles
- Parse frontmatter
- Validate required metadata
- Filter drafts from production
- Sort articles by publication date
- Generate static article pages
- Retrieve articles by slug
- Filter articles by category and tag
- Calculate reading time when it is not provided
- Return related articles based on shared categories and tags

Ensure that slugs and metadata are validated during the build.

## 7. Article Detail Page

Create an editorial reading experience optimized for long-form Persian writing.

Include:

- Breadcrumb navigation
- Category label
- Article title
- Article description
- Publication and update dates
- Estimated reading time
- Optional cover image
- Automatically generated table of contents
- Main MDX content
- Related articles
- Previous and next article links
- A link to return to the article archive

### Reading experience

- RTL layout throughout
- Comfortable line height, approximately 1.9–2.1
- Clear H2 and H3 hierarchy
- Proper styling for blockquotes, lists, tables, and horizontal rules
- Syntax-highlighted code blocks for technical articles
- Copy-code buttons where practical
- Styled inline code
- Responsive tables and code blocks
- Accessible links and focus states

Use a narrow reading column and generous vertical spacing.

An optional reading progress indicator may be implemented with a small client component, but it must not compromise static export or accessibility.

## 8. Article Archive

Implement `/articles` as a complete article index.

Features:

- Newest-first ordering
- Search by title, description, tags, and article content where practical
- Category filtering
- Tag filtering
- Featured article support
- Empty search state
- Clear filters action

Because the website has no backend, all search and filtering must operate on a locally generated article index.

For larger collections, generate a compact JSON search index at build time. Keep the full MDX content out of the browser unless needed.

## 9. Category Pages

Implement `/categories` and `/categories/[slug]`.

Create the following categories:

### Software Engineering
Slug: `software-engineering`

Topics include:

- Software architecture
- Backend development
- Distributed systems
- Engineering practices
- Technical leadership
- System design
- Developer tools

### Job Market
Slug: `job-market`

Topics include:

- Software engineering careers
- Technical interviews
- Career growth
- Engineering management
- Remote work
- Salaries and professional development

### Business Ideas
Slug: `business-ideas`

Topics include:

- Startup concepts
- Fintech and payment infrastructure
- SaaS business models
- Product strategy
- Market opportunities
- Business model validation

Each category page should include a title, description, article count, and a list of matching articles.

## 10. Search Functionality

Implement a fully client-side search experience.

Requirements:

- Search Persian and English text
- Search article titles, excerpts, tags, and relevant indexed content
- Normalize Persian and Arabic character variants, including `ي` / `ی` and `ك` / `ک`
- Normalize whitespace and optionally Persian and Arabic numerals
- Update results without page reloads
- Support keyboard navigation and accessible labels
- Show a clear empty state
- Include a search field on the homepage or header

The search page should be available at `/search`.

Use a small custom search utility or a lightweight local search library. Do not require an external search service.

## 11. About Page

Create a minimal Persian About page with a structure suitable for a software engineer.

Include editable local content for:

- A short personal introduction
- Professional interests
- Software engineering philosophy
- Thoughts on business and product development
- Contact and social links

Keep the writing authentic and understated. Do not invent employment history, credentials, or personal achievements.

Use placeholders for information that has not been supplied.

## 12. Theme Support

The primary design should use the warm ivory theme.

Optionally implement a dark theme using:

- Deep charcoal background
- Muted off-white text
- Desaturated green accents
- Subtle borders

Persist the selected theme in local storage if desired, with a small, hydration-safe client component.

Respect the user's system color preference initially and avoid flashing the wrong theme during page load.

If theme support adds unnecessary complexity, prioritize the light theme and excellent typography.

## 13. Responsive Design

Support:

- Large desktop screens
- Standard laptops
- Tablets
- Mobile devices

Desktop:
- Wide content area
- Optional sidebar with categories and author information
- Horizontal article rows

Tablet:
- Reduced whitespace
- Narrower content widths

Mobile:
- Single-column layout
- Compact header
- No horizontal overflow
- Readable typography
- Touch-friendly controls
- Optimized article images
- Proper RTL navigation and spacing

Use logical CSS properties such as `margin-inline`, `padding-inline`, and `border-inline-start` instead of assuming a left-to-right layout.

## 14. SEO and Accessibility

Implement:

- Persian page titles and descriptions
- Per-article metadata
- Canonical URLs
- Open Graph metadata
- Twitter card metadata
- A generated sitemap
- A robots.txt file
- Semantic HTML
- Accessible navigation
- Keyboard-accessible controls
- Sufficient color contrast
- Descriptive image alt text
- Correct heading order
- Appropriate article structured data where practical

Configure a single site URL through an environment variable or a clearly documented site configuration constant.

Do not invent a production domain.

All SEO features must work with static export.

## 15. Performance

Optimize for a fast, lightweight reading experience.

Requirements:

- Generate pages statically
- Minimize client components
- Avoid unnecessary JavaScript
- Use optimized local images
- Load fonts efficiently
- Avoid layout shifts
- Lazy-load below-the-fold images
- Avoid heavy animation libraries
- Keep dependencies minimal

Ensure that image handling is compatible with static export. If necessary, use pre-optimized local images instead of runtime image optimization.

## 16. Sample Content

Provide at least six realistic sample Persian articles across the three categories.

Suggested titles:

1. «معماری نرم‌افزار؛ از سرویس کوچک تا سیستم بزرگ»
2. «چه زمانی باید از معماری میکروسرویس استفاده کنیم؟»
3. «چگونه برای مصاحبه‌ی شغلی مهندسی نرم‌افزار آماده شویم؟»
4. «مسیر رشد از برنامه‌نویس تا مدیر فنی»
5. «چگونه یک ایده‌ی کسب‌وکار نرم‌افزاری را اعتبارسنجی کنیم؟»
6. «فرصت‌های ساخت محصول در زیرساخت پرداخت و فین‌تک»

Write useful introductory content in Persian for every sample article. Do not use repeated placeholder paragraphs or lorem ipsum.

Technical articles should include realistic examples, structured headings, and code snippets where appropriate.

Make all sample content easy to replace or extend.

## 17. Functional Requirements

The following must work without any backend:

- Navigation between all pages
- Article detail routes
- Category archives
- Tag filtering
- Search
- Featured article selection
- Related articles
- Previous and next article navigation
- Table of contents
- Theme switching if implemented
- Responsive navigation
- Static sitemap generation
- Custom 404 page

Do not add non-functional buttons or pretend that server-backed features exist.

Do not implement comments, newsletter subscriptions, analytics integrations, contact form submission, or authentication unless a purely static and clearly documented alternative is appropriate.

For contact, use a normal email link or external social links.

## 18. Deployment

Configure the project for static hosting.

Requirements:

- `next.config.ts` must enable static export.
- All required article routes must be generated at build time.
- No runtime backend or Node.js server should be required for production hosting.
- All assets must resolve correctly from the exported output.
- Internal navigation must work on static hosts.
- Document any hosting requirements for clean URLs and trailing slashes.
- Verify that the production build completes successfully.

The generated `out/` directory should be suitable for hosting on services such as GitHub Pages, Cloudflare Pages, or a static Nginx server.

## 19. Code Quality

- Use strict TypeScript.
- Follow consistent naming conventions.
- Keep components small and reusable.
- Separate article data processing from UI components.
- Avoid duplicated logic.
- Add useful error handling for malformed article metadata.
- Ensure the application builds without TypeScript errors.
- Avoid unnecessary abstractions.
- Include a README with installation, development, content authoring, build, and deployment instructions.

## 20. Implementation Workflow

Follow these steps:

1. Inspect the project structure and existing dependencies.
2. Set up Next.js, TypeScript, Tailwind CSS, and the static export configuration.
3. Establish the visual design system and RTL foundation.
4. Implement the shared layout and responsive navigation.
5. Implement local MDX content processing and validation.
6. Build the homepage, article archive, category pages, search, article detail pages, and About page.
7. Add Persian sample articles and local assets.
8. Implement SEO metadata and sitemap generation.
9. Test all routes, search, filtering, RTL behavior, mobile layouts, and static export.
10. Fix build errors and document the final project.

Do not stop after creating a homepage mockup. Complete the actual application.

## Final Acceptance Criteria

The project is complete only when:

- The design matches the minimalist Japanese-inspired art direction.
- All user-facing content is Persian and RTL.
- All three content categories are implemented.
- Articles are managed through local MDX files.
- Search and filtering work entirely on the client.
- All article routes are generated statically.
- No backend or database is required.
- The production static export builds successfully.
- The website works on mobile and desktop.
- The README explains how to add, edit, and publish articles.

Prioritize readability, simplicity, maintainability, and a polished editorial experience over unnecessary features.
