"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, setAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const value = (form: FormData, key: string) => String(form.get(key) || "").trim();
const collaborationOptions = new Set(["بازاریابی", "سرمایه گذاری", "خرید محصول", "صادرات", "فرآوری و بسته بندی", "سایر"]);
const maxImageSize = 2 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "storage", "uploads");
const allowedImages = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
  ["image/bmp", ".bmp"],
  ["image/svg+xml", ".svg"],
]);

async function saveImage(form: FormData, key: string) {
  const file = form.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > maxImageSize) throw new Error("حجم هر تصویر باید حداکثر ۲ مگابایت باشد.");

  const extension = allowedImages.get(file.type);
  if (!extension) throw new Error("فرمت تصویر معتبر نیست. از jpg، png، webp، gif، avif، bmp یا svg استفاده کنید.");

  await mkdir(uploadDir, { recursive: true });
  const filename = `${randomUUID()}${extension}`;
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

async function deleteImage(imageUrl: string | null | undefined) {
  if (!imageUrl) return;

  const pathname = new URL(imageUrl, "http://localhost").pathname;
  const match = pathname.match(/^\/uploads\/([0-9a-f-]{36}\.(?:jpe?g|png|webp|gif|avif|bmp|svg))$/i);
  if (!match) return;

  const filename = match[1];
  const candidates = [
    path.join(process.cwd(), "storage", "uploads", filename),
    path.join(process.cwd(), "public", "uploads", filename),
  ];

  for (const filePath of candidates) {
    try {
      await unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}

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
  const [currentContent, currentSponsors] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: 1 }, select: { heroImageUrl: true } }),
    prisma.sponsor.findMany({ select: { order: true, imageUrl: true } }),
  ]);
  const sponsorsByOrder = new Map(currentSponsors.map((sponsor) => [sponsor.order, sponsor]));
  const removeHeroImage = form.get("removeHeroImage") === "on";
  let heroImageUrl: string | null = null;
  try {
    heroImageUrl = await saveImage(form, "heroImage");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "آپلود تصویر ناموفق بود.");
  }

  await prisma.siteContent.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroEyebrow: value(form, "heroEyebrow"),
      heroTitle: value(form, "heroTitle"),
      heroDescription: value(form, "heroDescription"),
      heroCta: value(form, "heroCta"),
      heroImageUrl: heroImageUrl ?? (removeHeroImage ? null : currentContent?.heroImageUrl ?? null),
    },
    update: {
      heroEyebrow: value(form, "heroEyebrow"),
      heroTitle: value(form, "heroTitle"),
      heroDescription: value(form, "heroDescription"),
      heroCta: value(form, "heroCta"),
      heroImageUrl: heroImageUrl ?? (removeHeroImage ? null : currentContent?.heroImageUrl ?? null),
    },
  });

  if (heroImageUrl || removeHeroImage) await deleteImage(currentContent?.heroImageUrl);

  for (let number = 1; number <= 3; number++) {
    await prisma.stage.upsert({
      where: { number },
      create: { number, title: value(form, `stageTitle${number}`), description: value(form, `stageDescription${number}`) },
      update: { title: value(form, `stageTitle${number}`), description: value(form, `stageDescription${number}`) },
    });
  }

  for (let order = 1; order <= 5; order++) {
    const name = value(form, `sponsorName${order}`);
    const label = value(form, `sponsorLabel${order}`);
    const href = value(form, `sponsorHref${order}`) || "#";
    const currentSponsor = sponsorsByOrder.get(order);
    const removeSponsorImage = form.get(`removeSponsorImage${order}`) === "on";
    let imageUrl: string | null = null;

    if (!name) {
      await prisma.sponsor.deleteMany({ where: { order } });
      await deleteImage(currentSponsor?.imageUrl);
      continue;
    }

    try {
      imageUrl = await saveImage(form, `sponsorImage${order}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "آپلود تصویر حامی ناموفق بود.");
    }

    await prisma.sponsor.upsert({
      where: { order },
      create: { order, name, label: label || name.slice(0, 2), href, imageUrl: imageUrl ?? (removeSponsorImage ? null : currentSponsor?.imageUrl ?? null) },
      update: { name, label: label || name.slice(0, 2), href, imageUrl: imageUrl ?? (removeSponsorImage ? null : currentSponsor?.imageUrl ?? null) },
    });

    if (imageUrl || removeSponsorImage) await deleteImage(currentSponsor?.imageUrl);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1#content");
}

export async function deleteSubmission(form: FormData) {
  await requireAdmin();
  await prisma.submission.delete({ where: { id: Number(form.get("id")) } });
  revalidatePath("/admin");
}
