import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "کشاورز‌یار | پیوند کشاورزان و فرصت‌های همکاری",
    template: "%s | کشاورز‌یار",
  },
  description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
  applicationName: "کشاورز‌یار",
  keywords: ["کشاورزی", "کشاورزان ایران", "محصولات روستایی", "همکاری کشاورزی", "توسعه روستایی", "کشاورز‌یار"],
  authors: [{ name: "کشاورز‌یار" }],
  creator: "کشاورز‌یار",
  category: "agriculture",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "کشاورز‌یار",
    title: "کشاورز‌یار | از دل خاک برای فردای ایران",
    description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
  },
  twitter: {
    card: "summary_large_image",
    title: "کشاورز‌یار",
    description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa-IR" dir="rtl"><body>{children}</body></html>;
}
