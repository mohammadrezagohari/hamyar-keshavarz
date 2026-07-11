import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const token = () => createHash("sha256").update(process.env.SESSION_SECRET || "dev-secret").digest("hex");

export async function isAdmin() {
  const value = (await cookies()).get("admin_session")?.value;
  if (!value) return false;
  const expected = token();
  return value.length === expected.length && timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function setAdminSession() {
  (await cookies()).set("admin_session", token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 8, path: "/" });
}
