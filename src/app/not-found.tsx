import Link from "next/link";
export default function NotFound() {
  return (
    <div className="shell page empty">
      <p className="eyebrow">۴۰۴</p>
      <h1>این صفحه را پیدا نکردیم</h1>
      <p>شاید نشانی تغییر کرده باشد؛ از میان نوشته‌ها دوباره شروع کنیم.</p>
      <Link className="text-link" href="/articles/">
        بازگشت به نوشته‌ها ←
      </Link>
    </div>
  );
}
