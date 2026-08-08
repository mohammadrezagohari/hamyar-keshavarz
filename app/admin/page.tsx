import { deleteSubmission } from "@/app/actions";
import { AdminContentForm } from "@/components/AdminContentForm";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeSubmissionType, submissionWhere } from "@/lib/submission-filters";
import { Download, ExternalLink, FileText, Save, Search, Trash2, UsersRound } from "lucide-react";

export const dynamic = "force-dynamic";

const date = (d: Date) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(d);
const faNumber = new Intl.NumberFormat("fa-IR");
const pageSize = 10;

type AdminSearchParams = { saved?: string; q?: string; type?: string; page?: string };

export default async function AdminPage({ searchParams }: { searchParams?: Promise<AdminSearchParams> }) {
  await requireAdmin();
  const params = await searchParams;
  const saved = params?.saved === "1";
  const q = (params?.q || "").trim();
  const type = normalizeSubmissionType(params?.type);
  const where = submissionWhere(q, type);
  const totalSubmissions = await prisma.submission.count({ where });
  const totalPages = Math.max(1, Math.ceil(totalSubmissions / pageSize));
  const requestedPage = Math.max(1, Number.parseInt(params?.page || "1", 10) || 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const [content, stages, submissions, sponsors] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: 1 } }),
    prisma.stage.findMany({ orderBy: { number: "asc" } }),
    prisma.submission.findMany({ where, orderBy: { createdAt: "desc" }, skip: (currentPage - 1) * pageSize, take: pageSize }),
    prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!content) return null;
  const sponsorSlots = Array.from({ length: 5 }, (_, index) => sponsors.find((item) => item.order === index + 1));
  const queryString = new URLSearchParams({ ...(q ? { q } : {}), ...(type ? { type } : {}) }).toString();
  const pageHref = (page: number) => `/admin?${new URLSearchParams({ ...(q ? { q } : {}), ...(type ? { type } : {}), page: String(page) })}#requests`;

  return (
    <main className="admin-shell">
      <aside>
        <div className="admin-brand">
          <img src="/brand-logo.png" alt="همیار کشاورز" />
        </div>
        <a className="selected" href="#requests">
          <UsersRound size={19} /> درخواست‌ها
        </a>
        <a href="#content">
          <Save size={19} /> محتوای سایت
        </a>
        <a href="#sponsors">
          <UsersRound size={19} /> حامیان کار
        </a>
        <a href="/" target="_blank">
          مشاهده سایت <ExternalLink size={16} />
        </a>
      </aside>
      <div className="admin-main">
        <header>
          <div>
            <span>پنل مدیریت</span>
            <h1>سلام، خوش آمدید</h1>
          </div>
          <a href="/">مشاهده لندینگ</a>
        </header>

        <section id="requests" className="admin-section">
          <div className="admin-heading">
            <div>
              <h2>درخواست‌های ثبت‌شده</h2>
              <p>همه پیام‌های کشاورزان و همیاران کشاورز</p>
            </div>
            <b>{faNumber.format(totalSubmissions)} درخواست</b>
          </div>
          <div className="request-tools">
            <form className="request-filters" action="/admin" method="get">
              <label>
                <Search size={17} aria-hidden="true" />
                <input name="q" defaultValue={q} placeholder="جست‌وجوی نام، موبایل یا جزئیات" />
              </label>
              <select name="type" defaultValue={type} aria-label="نوع درخواست">
                <option value="">همه درخواست‌ها</option>
                <option value="farmer">کشاورزان</option>
                <option value="partner">همیاران</option>
              </select>
              <button type="submit">اعمال فیلتر</button>
              {(q || type) && <a href="/admin#requests">پاک‌کردن</a>}
            </form>
            <div className="export-actions">
              <a className="excel-export" href={`/admin/submissions/export${queryString ? `?${queryString}` : ""}`}>
                <Download size={17} aria-hidden="true" /> خروجی XLSX
              </a>
              <a className="pdf-export" href={`/admin/submissions/export/pdf${queryString ? `?${queryString}` : ""}`}>
                <FileText size={17} aria-hidden="true" /> خروجی PDF
              </a>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>نوع</th>
                  <th>نام</th>
                  <th>شماره تماس</th>
                  <th>جزئیات</th>
                  <th>زمان ثبت</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-data">
                      {q || type ? "درخواستی مطابق فیلتر پیدا نشد." : "هنوز درخواستی ثبت نشده است."}
                    </td>
                  </tr>
                ) : (
                  submissions.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <span className={`badge ${item.type}`}>{item.type === "farmer" ? "کشاورز" : "همیار"}</span>
                      </td>
                      <td>
                        <b>{item.name}</b>
                      </td>
                      <td dir="ltr">{item.phone}</td>
                      <td>
                        {item.type === "farmer"
                          ? `${item.province || "-"} / ${item.city || "-"} / ${item.village || "-"} / ${item.product || "-"}`
                          : item.collaboration}
                      </td>
                      <td>{date(item.createdAt)}</td>
                      <td>
                        <form action={deleteSubmission}>
                          <input type="hidden" name="id" value={item.id} />
                          <button className="delete" title="حذف">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <nav className="admin-pagination" aria-label="صفحه‌بندی درخواست‌ها">
              {currentPage > 1 ? <a href={pageHref(currentPage - 1)}>صفحه قبل</a> : <span>صفحه قبل</span>}
              <b>صفحه {faNumber.format(currentPage)} از {faNumber.format(totalPages)}</b>
              {currentPage < totalPages ? <a href={pageHref(currentPage + 1)}>صفحه بعد</a> : <span>صفحه بعد</span>}
            </nav>
          )}
        </section>

        <section id="content" className="admin-section">
          <div className="admin-heading">
            <div>
              <h2>ویرایش محتوای لندینگ</h2>
              <p>تغییرات پس از ذخیره، بلافاصله در سایت نمایش داده می‌شوند.</p>
            </div>
          </div>
          <AdminContentForm saved={saved}>
            <h3>بنر اصلی</h3>
            <div className="admin-grid">
              <label>
                متن بالای عنوان
                <input name="heroEyebrow" defaultValue={content.heroEyebrow} />
              </label>
              <label>
                متن دکمه
                <input name="heroCta" defaultValue={content.heroCta} />
              </label>
              <label className="full">
                عنوان اصلی
                <input name="heroTitle" defaultValue={content.heroTitle} />
              </label>
              <label className="full">
                توضیحات
                <textarea name="heroDescription" defaultValue={content.heroDescription} rows={3} />
              </label>
              <label className="full upload-field">
                تصویر بنر اصلی
                {content.heroImageUrl && <img src={content.heroImageUrl} alt="تصویر فعلی بنر اصلی" />}
                <input name="heroImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/svg+xml" />
                {content.heroImageUrl && (
                  <span className="remove-image"><input name="removeHeroImage" type="checkbox" /> حذف تصویر فعلی</span>
                )}
                <small>حداکثر ۲ مگابایت؛ فرمت‌های رایج تصویر مجاز هستند.</small>
              </label>
            </div>

            <h3>مراحل همکاری</h3>
            {stages.map((stage) => (
              <div className="stage-edit" key={stage.id}>
                <b>مرحله {stage.number}</b>
                <label>
                  عنوان
                  <input name={`stageTitle${stage.number}`} defaultValue={stage.title} />
                </label>
                <label>
                  توضیحات
                  <textarea name={`stageDescription${stage.number}`} defaultValue={stage.description} rows={2} />
                </label>
                <label className="upload-field stage-icon-field">
                  آیکون اختیاری
                  {stage.iconImageUrl && <img src={stage.iconImageUrl} alt={`آیکون مرحله ${stage.number}`} />}
                  <input name={`stageIcon${stage.number}`} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" />
                  {stage.iconImageUrl && (
                    <span className="remove-image"><input name={`removeStageIcon${stage.number}`} type="checkbox" /> بدون آیکون</span>
                  )}
                  <small>JPG، PNG، SVG یا WebP؛ حداکثر ۲ مگابایت</small>
                </label>
              </div>
            ))}

            <h3>بخش نقشه ایران</h3>
            <div className="admin-grid map-content-fields">
              <label>
                متن بالای عنوان
                <input name="mapEyebrow" defaultValue={content.mapEyebrow} />
              </label>
              <label>
                عدد آمار
                <input name="mapStatNumber" defaultValue={content.mapStatNumber} placeholder="مثلاً ۳۱" />
              </label>
              <label className="full">
                عنوان اصلی
                <textarea name="mapTitle" defaultValue={content.mapTitle} rows={2} />
                <small>برای نمایش عنوان در چند خط، از Enter استفاده کنید.</small>
              </label>
              <label className="full">
                توضیحات
                <textarea name="mapDescription" defaultValue={content.mapDescription} rows={3} />
              </label>
              <label>
                متن کنار آمار
                <input name="mapStatLabel" defaultValue={content.mapStatLabel} />
              </label>
              <label>
                زیرنویس نقشه
                <input name="mapCaption" defaultValue={content.mapCaption} />
              </label>
            </div>

            <h3 id="sponsors">حامیان کار</h3>
            <label className="visibility-toggle">
              <input name="showSponsors" type="checkbox" defaultChecked={content.showSponsors} />
              <span><b>نمایش بخش حامیان در سایت</b><small>با خاموش‌کردن این گزینه، اطلاعات حامیان حفظ می‌شود اما بخش در سایت نمایش داده نمی‌شود.</small></span>
            </label>
            {sponsorSlots.map((sponsor, index) => {
              const order = index + 1;
              return (
                <div className="sponsor-edit" key={order}>
                  <b>حامی {order}</b>
                  <label>
                    نام حامی
                    <input name={`sponsorName${order}`} defaultValue={sponsor?.name || ""} placeholder="مثلا بانک کشاورزی" />
                  </label>
                  <label>
                    متن کوتاه لوگو
                    <input name={`sponsorLabel${order}`} defaultValue={sponsor?.label || ""} placeholder="مثلا بک" maxLength={4} />
                  </label>
                  <label>
                    لینک
                    <input name={`sponsorHref${order}`} defaultValue={sponsor?.href || "#"} dir="ltr" placeholder="https://example.com" />
                  </label>
                  <label className="upload-field">
                    تصویر لوگو
                    {sponsor?.imageUrl && <img src={sponsor.imageUrl} alt={`لوگوی ${sponsor.name}`} />}
                    <input name={`sponsorImage${order}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/bmp,image/svg+xml" />
                    {sponsor?.imageUrl && (
                      <span className="remove-image"><input name={`removeSponsorImage${order}`} type="checkbox" /> حذف تصویر فعلی</span>
                    )}
                    <small>حداکثر ۲ مگابایت</small>
                  </label>
                </div>
              );
            })}

            <h3>بخش «داستان ما»</h3>
            <div className="admin-grid story-content-fields">
              <label className="full">
                عنوان بخش
                <input name="storyTitle" defaultValue={content.storyTitle} placeholder="داستان ما" />
              </label>
              <label className="full">
                متن داستان
                <textarea name="storyContent" defaultValue={content.storyContent} rows={7} placeholder="داستان شکل‌گیری و مسیر کشاورزیار را بنویسید..." />
                <small>برای ایجاد پاراگراف یا خط جدید، از Enter استفاده کنید.</small>
              </label>
            </div>
          </AdminContentForm>
        </section>
      </div>
    </main>
  );
}
