import ExcelJS from "exceljs";
import { requireAdmin } from "@/lib/auth";
import { exportDate, getExportSubmissions, submissionTypeLabel } from "@/lib/submission-export";

export const dynamic = "force-dynamic";

const safeCell = (value: string | null | undefined) => {
  const text = value || "";
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
};

export async function GET(request: Request) {
  await requireAdmin();
  const submissions = await getExportSubmissions(request);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "کشاورزیار";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("درخواست‌ها", {
    views: [{ rightToLeft: true, state: "frozen", ySplit: 1 }],
  });
  sheet.columns = [
    { header: "شناسه", key: "id", width: 10 },
    { header: "نوع", key: "type", width: 14 },
    { header: "نام", key: "name", width: 24 },
    { header: "شماره تماس", key: "phone", width: 18 },
    { header: "استان", key: "province", width: 18 },
    { header: "شهرستان", key: "city", width: 18 },
    { header: "روستا", key: "village", width: 20 },
    { header: "محصول", key: "product", width: 20 },
    { header: "زمینه همکاری", key: "collaboration", width: 32 },
    { header: "زمان ثبت", key: "createdAt", width: 25 },
  ];

  submissions.forEach((item) => {
    sheet.addRow({
      id: item.id,
      type: submissionTypeLabel(item.type),
      name: safeCell(item.name),
      phone: safeCell(item.phone),
      province: safeCell(item.province),
      city: safeCell(item.city),
      village: safeCell(item.village),
      product: safeCell(item.product),
      collaboration: safeCell(item.collaboration),
      createdAt: exportDate(item.createdAt),
    });
  });

  const header = sheet.getRow(1);
  header.height = 28;
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF236B4D" } };
  header.alignment = { horizontal: "center", vertical: "middle" };
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.alignment = { horizontal: "right", vertical: "middle", wrapText: true };
      row.height = 24;
      if (rowNumber % 2 === 0) row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F8EE" } };
    }
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD9E4D1" } },
        left: { style: "thin", color: { argb: "FFD9E4D1" } },
        bottom: { style: "thin", color: { argb: "FFD9E4D1" } },
        right: { style: "thin", color: { argb: "FFD9E4D1" } },
      };
    });
  });
  sheet.autoFilter = { from: "A1", to: "J1" };

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
