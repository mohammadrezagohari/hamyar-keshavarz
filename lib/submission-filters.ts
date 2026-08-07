import type { Prisma } from "@prisma/client";

export function normalizeSubmissionType(value: string | null | undefined) {
  return value === "farmer" || value === "partner" ? value : "";
}

export function submissionWhere(q: string, type: string): Prisma.SubmissionWhereInput {
  const query = q.trim();

  return {
    ...(type ? { type } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { phone: { contains: query } },
            { province: { contains: query } },
            { city: { contains: query } },
            { village: { contains: query } },
            { product: { contains: query } },
            { collaboration: { contains: query } },
          ],
        }
      : {}),
  };
}
