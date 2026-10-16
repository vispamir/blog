import Link from "next/link";
import { Heart, Mountain } from "lucide-react";
export function Footer() {
  return (
    <footer className="shell footer">
      <Link
        className="post-footer-logo"
        href="/"
        aria-label="امیر کولیوند؛ خانه"
      >
        <Mountain size={42} strokeWidth={1.2} />
      </Link>
      <p>© ۱۴۰۵ امیر کولیوند</p>
      <span className="footer-divider" aria-hidden="true">
        |
      </span>
      <p>ساخته‌شده با علاقه</p>
      <Heart size={14} strokeWidth={1.4} aria-hidden="true" />
      <nav className="post-footer-nav" aria-label="پیوندهای پایانی">
        <Link href="/">خانه</Link>
        <Link href="/articles/">نوشته‌ها</Link>
        <Link href="/categories/">دسته‌بندی‌ها</Link>
        <Link href="/about/">درباره من</Link>
      </nav>
    </footer>
  );
}
