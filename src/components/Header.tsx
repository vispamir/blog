"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
const links = [
  ["/", "خانه"],
  ["/about/", "درباره من"],
  ["/about/#contact", "تماس"],
];
const mobileLinks = [
  ["/", "خانه"],
  ["/articles/", "نوشته‌ها"],
  ["/categories/", "دسته‌بندی‌ها"],
  ["/about/", "درباره من"],
  ["/about/#contact", "تماس"],
];
export function Header() {
  const pathname = usePathname();
  const isPost =
    pathname.startsWith("/articles/") &&
    pathname.replace(/\/$/, "") !== "/articles";
  const navLinks = isPost
    ? [
        ["/", "خانه"],
        ["/articles/", "نوشته‌ها"],
        ["/categories/", "دسته‌بندی‌ها"],
        ["/about/", "درباره من"],
      ]
    : links;
  const active = (url: string) =>
    url === "/"
      ? pathname === "/"
      : !url.includes("#") &&
        (pathname.replace(/\/$/, "") === url.replace(/\/$/, "") ||
          (isPost && url === "/articles/"));
  return (
    <header className={`header shell ${isPost ? "post-site-header" : ""}`}>
      <Link className="brand" href="/" aria-label="امیر کولیوند؛ خانه">
        <svg
          width="47"
          height="30"
          viewBox="0 0 47 30"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m2 23 12-13 12 13M13 20 29 6l16 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>امیر کولیوند</span>
      </Link>
      <nav className="desktop-nav" aria-label="ناوبری اصلی">
        {navLinks.map(([url, title]) => (
          <Link
            href={url}
            key={url}
            aria-current={active(url) ? "page" : undefined}
          >
            {title}
          </Link>
        ))}
      </nav>
      <Link className="search-link" href="/search/" aria-label="جست‌وجو">
        <Search size={20} strokeWidth={1.7} />
      </Link>
      <details className="mobile-menu">
        <summary>فهرست</summary>
        <nav aria-label="ناوبری همراه">
          {mobileLinks.map(([url, title]) => (
            <Link
              href={url}
              key={url}
              onClick={(e) =>
                e.currentTarget.closest("details")?.removeAttribute("open")
              }
            >
              {title}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
