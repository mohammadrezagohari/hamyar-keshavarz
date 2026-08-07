import type { Submission } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeSubmissionType, submissionWhere } from "@/lib/submission-filters";

export async function getExportSubmissions(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  const type = normalizeSubmissionType(url.searchParams.get("type"));
  return prisma.submission.findMany({
    where: submissionWhere(q, type),
    orderBy: { createdAt: "desc" },
  });
}

export function submissionTypeLabel(type: string) {
  return type === "farmer" ? "کشاورز" : "همیار";
}

export function submissionDetails(item: Submission) {
  return item.type === "farmer"
    ? [item.province, item.city, item.village, item.product].filter(Boolean).join(" / ")
    : item.collaboration || "-";
}

export const exportDate = (date: Date) =>
  new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(date);
