"use client";

import { useActionState, useEffect, useState } from "react";
import { Handshake, Sprout, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/app/actions";

const initial: { ok: boolean; error?: string } = { ok: false };

export function LeadForm() {
  const [type, setType] = useState<"farmer" | "partner">("farmer");
  const [state, action, pending] = useActionState(submitLead, initial);
  useEffect(() => { if (state.ok) document.querySelector<HTMLFormElement>("#lead-form")?.reset(); }, [state.ok]);

  return (
    <div className="form-card">
      <div className="form-head">
        <span>شروع یک مسیر تازه</span>
        <h2>چطور می‌خواهید همراه شوید؟</h2>
        <p>اطلاعات شما نزد ما محفوظ است؛ خیلی زود با شما تماس می‌گیریم.</p>
      </div>
      <div className="switcher" aria-label="انتخاب نوع درخواست">
        <button aria-pressed={type === "farmer"} className={type === "farmer" ? "active" : ""} onClick={() => setType("farmer")} type="button"><Sprout size={20} aria-hidden="true"/> کشاورز هستم</button>
        <button aria-pressed={type === "partner"} className={type === "partner" ? "active" : ""} onClick={() => setType("partner")} type="button"><Handshake size={20} aria-hidden="true"/> متقاضی همکاری‌ام</button>
      </div>
      <form id="lead-form" action={action}>
        <input type="hidden" name="type" value={type}/>
        <div className="field-grid">
          <label><span>نام و نام خانوادگی</span><input name="name" required placeholder="مثلاً علی رضایی"/></label>
          <label><span>شماره تماس</span><input name="phone" required inputMode="numeric" dir="ltr" placeholder="09123456789" pattern="09[0-9]{9}"/></label>
          {type === "farmer" ? <>
            <label><span>نام روستا / منطقه</span><input name="village" required placeholder="مثلاً روستای کندلوس"/></label>
            <label><span>محصول یا توانمندی</span><input name="product" required placeholder="مثلاً زعفران، عسل یا صنایع دستی"/></label>
          </> : <label className="wide"><span>زمینه همکاری و مشارکت</span><textarea name="collaboration" required placeholder="در چه زمینه‌ای می‌توانید با کشاورز‌یار همراه شوید؟" rows={3}/></label>}
        </div>
        {state.error && <p className="form-message error" role="alert">{state.error}</p>}
        {state.ok && <p className="form-message success" role="status"><CheckCircle2 size={19} aria-hidden="true"/> اطلاعات شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.</p>}
        <button className="submit" disabled={pending}>{pending ? "در حال ثبت..." : "ثبت درخواست و شروع همکاری"}</button>
      </form>
    </div>
  );
}
