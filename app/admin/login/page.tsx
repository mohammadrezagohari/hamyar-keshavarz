"use client";
import { useActionState } from "react";
import { login } from "@/app/actions";
import { Leaf, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, {} as { error?: string });
  return <main className="auth-page"><form action={action} className="auth-card"><div className="auth-logo"><Leaf/></div><h1>مدیریت کشاورز‌یار</h1><p>برای ورود به پنل، رمز عبور مدیریت را وارد کنید.</p><label><LockKeyhole size={18}/><input name="password" type="password" required placeholder="رمز عبور" autoFocus/></label>{state.error && <div className="admin-error">{state.error}</div>}<button disabled={pending}>{pending ? "در حال ورود..." : "ورود به پنل"}</button><a href="/">بازگشت به صفحه اصلی</a></form></main>;
}
