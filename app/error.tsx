"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <main className="friendly-error">
      <section>
        <img src="/brand-logo.png" alt="همیار کشاورز" />
        <h1>مشکلی پیش آمد</h1>
        <p>درخواست شما کامل نشد. لطفاً دوباره تلاش کنید و اگر مشکل ادامه داشت، چند دقیقه بعد برگردید.</p>
        <div><button onClick={reset}>تلاش دوباره</button><a href="/">بازگشت به صفحه اصلی</a></div>
      </section>
    </main>
  );
}
