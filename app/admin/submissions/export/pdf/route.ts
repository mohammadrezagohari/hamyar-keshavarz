import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import { requireAdmin } from "@/lib/auth";
import { exportDate, getExportSubmissions, submissionDetails, submissionTypeLabel } from "@/lib/submission-export";

export const dynamic = "force-dynamic";

const fontCandidates = [
  process.env.PDF_FONT_PATH,
  "C:/Windows/Fonts/tahoma.ttf",
  "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  "/usr/share/fonts/truetype/noto/NotoNaskhArabic-Regular.ttf",
].filter((item): item is string => Boolean(item));

const widths = [38, 58, 112, 100, 330, 112];
const headers = ["ردیف", "نوع", "نام", "شماره تماس", "جزئیات", "زمان ثبت"];

export async function GET(request: Request) {
  await requireAdmin();
  const submissions = await getExportSubmissions(request);
  const fontPath = fontCandidates.find(existsSync);
  if (!fontPath) return new Response("PDF font is not configured", { status: 500 });

  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margins: { top: 32, right: 30, bottom: 32, left: 30 },
    bufferPages: true,
    font: fontPath,
  });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  doc.font(fontPath);

  const drawText = (text: string, x: number, y: number, width: number, options: PDFKit.Mixins.TextOptions = {}) => {
    doc.text(text, x, y, { width, align: "right", lineBreak: false, ellipsis: true, features: ["rtla"], ...options });
  };
  const drawHeader = () => {
    doc.fillColor("#236b4d").fontSize(17).text("گزارش درخواست‌های ثبت‌شده کشاورزیار", 30, 28, { width: 780, align: "right", features: ["rtla"] });
    const y = 62;
    let x = 30;
    doc.rect(30, y, 750, 28).fill("#236b4d");
    doc.fillColor("#ffffff").fontSize(9);
    headers.forEach((label, index) => {
      drawText(label, x + 4, y + 9, widths[index] - 8);
      x += widths[index];
    });
    return 90;
  };

  let y = drawHeader();
  submissions.forEach((item, index) => {
    if (y + 34 > doc.page.height - 32) {
      doc.addPage();
      doc.font(fontPath);
      y = drawHeader();
    }
    if (index % 2 === 0) doc.rect(30, y, 750, 34).fill("#f3f8ee");
    doc.rect(30, y, 750, 34).strokeColor("#d9e4d1").lineWidth(0.5).stroke();
    doc.fillColor("#263b32").fontSize(8.5);
    const cells = [String(index + 1), submissionTypeLabel(item.type), item.name, item.phone, submissionDetails(item), exportDate(item.createdAt)];
    let x = 30;
    cells.forEach((cell, cellIndex) => {
      drawText(cell, x + 4, y + 11, widths[cellIndex] - 8);
      x += widths[cellIndex];
    });
    y += 34;
  });
  if (submissions.length === 0) {
    doc.fillColor("#667c70").fontSize(11).text("درخواستی مطابق فیلتر انتخاب‌شده وجود ندارد.", 30, 112, { width: 750, align: "center", features: ["rtla"] });
  }
  doc.end();

  const buffer = await completed;
  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
