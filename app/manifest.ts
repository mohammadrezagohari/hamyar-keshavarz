import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "کشاورزیار",
    short_name: "کشاورزیار",
    description: "پیوند کشاورزان محلی با فرصت‌های همکاری و رشد پایدار",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3e9",
    theme_color: "#173f32",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/brand-logo.png", sizes: "1254x1254", type: "image/png" },
    ],
  };
}
