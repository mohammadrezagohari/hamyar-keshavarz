"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { updateContent, type ContentActionState } from "@/app/actions";

const initialState: ContentActionState = { ok: false };
const maxImageSize = 2 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/bmp", "image/svg+xml"]);

export function AdminContentForm({ children, saved }: { children: React.ReactNode; saved: boolean }) {
  const [state, action, pending] = useActionState(updateContent, initialState);
  const [clientError, setClientError] = useState<string>();

  const validateUploads = (event: React.FormEvent<HTMLFormElement>) => {
    const files = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>('input[type="file"]'))
      .flatMap((input) => Array.from(input.files ?? []));
    if (files.some((file) => file.size > maxImageSize)) {
      event.preventDefault();
      setClientError("حجم هر فایل باید حداکثر ۲ مگابایت باشد.");
      return;
    }
    if (files.some((file) => !allowedImageTypes.has(file.type))) {
      event.preventDefault();
      setClientError("فرمت یکی از تصاویر معتبر نیست. لطفاً از فرمت‌های مجاز استفاده کنید.");
      return;
    }
    setClientError(undefined);
  };

  return (
    <form action={action} className="content-form" aria-busy={pending} onSubmit={validateUploads}>
      {(saved || state.ok) && !clientError && !state.error && <p className="admin-success" role="status">تغییرات با موفقیت ذخیره شد.</p>}
      {(clientError || state.error) && <p className="admin-action-error" role="alert">{clientError || state.error}</p>}
      {children}
      <button className="save" disabled={pending}>
        <Save size={18} aria-hidden="true" /> {pending ? "در حال ذخیره..." : "ذخیره همه تغییرات"}
      </button>
    </form>
  );
}
