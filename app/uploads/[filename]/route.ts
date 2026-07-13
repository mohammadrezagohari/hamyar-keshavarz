import { readFile } from "fs/promises";
import path from "path";

const imageTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".svg": "image/svg+xml",
};

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  // Uploaded names are generated UUIDs. Rejecting every other shape also prevents
  // this route from being used to read arbitrary files from the server.
  if (!/^[0-9a-f-]{36}\.(?:jpe?g|png|webp|gif|avif|bmp|svg)$/i.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  const extension = path.extname(filename).toLowerCase();
  const candidates = [
    path.join(process.cwd(), "storage", "uploads", filename),
    // Keep images uploaded before the dynamic upload route working.
    path.join(process.cwd(), "public", "uploads", filename),
  ];

  for (const filePath of candidates) {
    try {
      const image = await readFile(filePath);
      return new Response(image, {
        headers: {
          "Content-Type": imageTypes[extension] || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
    }
  }

  return new Response("Not found", { status: 404 });
}
