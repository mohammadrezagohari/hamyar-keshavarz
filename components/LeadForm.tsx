"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Handshake, Sprout } from "lucide-react";
import { submitLead } from "@/app/actions";

type Location = {
  id: number;
  name: string;
  cities: { id: number; name: string }[];
};

const initial: { ok: boolean; error?: string } = { ok: false };

const collaborationOptions = [
  "بازاریابی",
  "سرمایه گذاری",
  "خرید محصول",
  "صادرات",
  "فرآوری و بسته بندی",
  "سایر",
];

export function LeadForm({ locations }: { locations: Location[] }) {
  const [type, setType] = useState<"partner" | "farmer">("partner");
  const [province, setProvince] = useState("");
  const [collaboration, setCollaboration] = useState(collaborationOptions[0]);
  const [state, action, pending] = useActionState(submitLead, initial);

  const cities = useMemo(
    () => locations.find((item) => item.name === province)?.cities ?? [],
    [locations, province],
  );

  useEffect(() => {
    if (state.ok) {
      document.querySelector<HTMLFormElement>("#lead-form")?.reset();
      setProvince("");
      setCollaboration(collaborationOptions[0]);
    }
  }, [state.ok]);

  return (
    <div className="form-card">
      <div className="form-head">
        <span>ثبت درخواست همکاری</span>
        <h2>{type === "partner" ? "همیاران کشاورز" : "کشاورزان"}</h2>
      </div>
      <div className="switcher" aria-label="انتخاب نوع فرم">
        <button
          aria-pressed={type === "partner"}
          className={type === "partner" ? "active" : ""}
          onClick={() => setType("partner")}
          type="button"
        >
          <Handshake size={20} aria-hidden="true" /> همیاران کشاورز
        </button>
        <button
          aria-pressed={type === "farmer"}
          className={type === "farmer" ? "active" : ""}
          onClick={() => setType("farmer")}
          type="button"
        >
          <Sprout size={20} aria-hidden="true" /> کشاورزان
        </button>
      </div>
      <form id="lead-form" action={action}>
        <input type="hidden" name="type" value={type} />
        <div className="field-grid">
          <label>
            <span>نام و نام خانوادگی</span>
            <input name="name" required placeholder="مثلا علی رضایی" />
          </label>
          <label>
            <span>شماره تماس</span>
            <input name="phone" required inputMode="numeric" dir="ltr" placeholder="09123456789" pattern="09[0-9]{9}" />
          </label>

          {type === "farmer" ? (
            <>
              <label>
                <span>استان</span>
                <select name="province" required value={province} onChange={(event) => setProvince(event.target.value)}>
                  <option value="">انتخاب استان</option>
                  {locations.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>شهرستان</span>
                <select name="city" required disabled={!province}>
                  <option value="">انتخاب شهرستان</option>
                  {cities.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>نام روستا</span>
                <input name="village" required placeholder="مثلا روستای کندلوس" />
              </label>
              <label>
                <span>نام محصول</span>
                <input name="product" required placeholder="مثلا زعفران، عسل یا پسته" />
              </label>
            </>
          ) : (
            <>
              <label className="wide">
                <span>زمینه همکاری</span>
                <select name="collaboration" required value={collaboration} onChange={(event) => setCollaboration(event.target.value)}>
                  {collaborationOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              {collaboration === "سایر" && (
                <label className="wide">
                  <span>توضیح زمینه همکاری</span>
                  <textarea name="collaborationOther" required placeholder="زمینه همکاری مورد نظرتان را بنویسید" rows={3} />
                </label>
              )}
            </>
          )}
        </div>
        {state.error && (
          <p className="form-message error" role="alert">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p className="form-message success" role="status">
            <CheckCircle2 size={19} aria-hidden="true" /> اطلاعات شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.
          </p>
        )}
        <button className="submit" disabled={pending}>
          {pending ? "در حال ثبت..." : "ثبت درخواست"}
        </button>
      </form>
    </div>
  );
}
