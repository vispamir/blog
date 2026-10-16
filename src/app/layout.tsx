import type { Metadata } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: site.url ? new URL(site.url) : undefined,
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    locale: "fa_IR",
    type: "website",
    siteName: site.title,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <a className="skip-link" href="#main">
          رفتن به محتوا
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
