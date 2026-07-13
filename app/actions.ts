"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, setAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const value = (form: FormData, key: string) => String(form.get(key) || "").trim();
const collaborationOptions = new Set(["بازاریابی", "سرمایه گذاری", "خرید محصول", "صادرات", "فرآوری و بسته بندی", "سایر"]);

export async function submitLead(_: { ok: boolean; error?: string }, form: FormData): Promise<{ ok: boolean; error?: string }> {
  const type = value(form, "type");
  const name = value(form, "name");
  const phone = value(form, "phone");

  if (!name || !/^09\d{9}$/.test(phone)) {
    return { ok: false, error: "نام و شماره موبایل معتبر را وارد کنید." };
  }

  if (type === "farmer") {
    const province = value(form, "province");
    const city = value(form, "city");
    const village = value(form, "village");
    const product = value(form, "product");

    if (!province || !city || !village || !product) {
      return { ok: false, error: "استان، شهرستان، نام روستا و نام محصول را کامل کنید." };
    }

    const location = await prisma.city.findFirst({ where: { name: city, province: { name: province } } });
    if (!location) return { ok: false, error: "استان و شهرستان انتخاب‌شده معتبر نیست." };

    await prisma.submission.create({ data: { type, name, phone, province, city, village, product } });
  } else {
    const collaboration = value(form, "collaboration");
    const collaborationOther = value(form, "collaborationOther");

    if (!collaborationOptions.has(collaboration)) {
      return { ok: false, error: "زمینه همکاری را انتخاب کنید." };
    }
    if (collaboration === "سایر" && !collaborationOther) {
      return { ok: false, error: "توضیح زمینه همکاری را وارد کنید." };
    }

    await prisma.submission.create({
      data: {
        type: "partner",
        name,
        phone,
        collaboration: collaboration === "سایر" ? `سایر: ${collaborationOther}` : collaboration,
      },
    });
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function login(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  if (value(form, "password") !== process.env.ADMIN_PASSWORD) return { error: "رمز عبور صحیح نیست." };
  await setAdminSession();
  redirect("/admin");
}

export async function updateContent(form: FormData) {
  await requireAdmin();
  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroEyebrow: value(form, "heroEyebrow"),
      heroTitle: value(form, "heroTitle"),
      heroDescription: value(form, "heroDescription"),
      heroCta: value(form, "heroCta"),
    },
    update: {
      heroEyebrow: value(form, "heroEyebrow"),
      heroTitle: value(form, "heroTitle"),
      heroDescription: value(form, "heroDescription"),
      heroCta: value(form, "heroCta"),
    },
  });

  for (let number = 1; number <= 3; number++) {
    await prisma.stage.upsert({
      where: { number },
      create: { number, title: value(form, `stageTitle${number}`), description: value(form, `stageDescription${number}`) },
      update: { title: value(form, `stageTitle${number}`), description: value(form, `stageDescription${number}`) },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteSubmission(form: FormData) {
  await requireAdmin();
  await prisma.submission.delete({ where: { id: Number(form.get("id")) } });
  revalidatePath("/admin");
}
