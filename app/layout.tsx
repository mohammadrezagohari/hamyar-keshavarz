import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hamyarkeshavarz.com"),
  title: {
    default: "کشاورزیار | پیوند کشاورزان و فرصت‌های همکاری",
    template: "%s | کشاورزیار",
  },
  description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
  applicationName: "کشاورزیار",
  keywords: ["کشاورزی", "کشاورزان ایران", "محصولات روستایی", "همکاری کشاورزی", "توسعه روستایی", "کشاورزیار"],
  authors: [{ name: "کشاورزیار" }],
  creator: "کشاورزیار",
  category: "agriculture",
  alternates: { canonical: "/" },
  twitter: {
    card: "summary_large_image",
    title: "کشاورزیار",
    description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
    images: ["/brand-logo.png"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  icons: { icon: "/brand-logo.png", apple: "/brand-logo.png" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: "کشاورزیار",
    title: "کشاورزیار | از دل خاک برای فردای ایران",
    description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
    images: [{ url: "/brand-logo.png", width: 1254, height: 1254, alt: "همیار کشاورز" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
