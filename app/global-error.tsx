"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body style={{ margin: 0, fontFamily: "Tahoma, sans-serif", background: "#f7f3e9", color: "#173f32" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <section style={{ maxWidth: 520, padding: 36, borderRadius: 18, background: "#fff", boxShadow: "0 20px 60px #173f3220" }}>
            <h1>مشکلی پیش آمد</h1>
            <p style={{ lineHeight: 2, color: "#6f7d76" }}>نمایش صفحه ممکن نشد. لطفاً دوباره تلاش کنید.</p>
            <button onClick={reset} style={{ border: 0, borderRadius: 8, padding: "12px 22px", background: "#173f32", color: "#fff", cursor: "pointer" }}>تلاش دوباره</button>
          </section>
        </main>
      </body>
    </html>
  );
}
