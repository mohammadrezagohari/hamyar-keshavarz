import { deleteSubmission, updateContent } from "@/app/actions";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExternalLink, Leaf, Save, Trash2, UsersRound } from "lucide-react";

export const dynamic = "force-dynamic";

const date = (d: Date) => new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(d);

export default async function AdminPage({ searchParams }: { searchParams?: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const saved = params?.saved === "1";
  const [content, stages, submissions, sponsors] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: 1 } }),
    prisma.stage.findMany({ orderBy: { number: "asc" } }),
    prisma.submission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!content) return null;
  const sponsorSlots = Array.from({ length: 5 }, (_, index) => sponsors.find((item) => item.order === index + 1));

  return (
    <main className="admin-shell">
      <aside>
        <div className="admin-brand">
          <Leaf /> کشاورزیار
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
            <b>{submissions.length} درخواست</b>
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
                      هنوز درخواستی ثبت نشده است.
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
        </section>

        <section id="content" className="admin-section">
          <div className="admin-heading">
            <div>
              <h2>ویرایش محتوای لندینگ</h2>
              <p>تغییرات پس از ذخیره، بلافاصله در سایت نمایش داده می‌شوند.</p>
            </div>
          </div>
          <form action={updateContent} className="content-form">
            {saved && <p className="admin-success">تغییرات با موفقیت ذخیره شد.</p>}
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
              </div>
            ))}

            <h3 id="sponsors">حامیان کار</h3>
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
            <button className="save">
              <Save size={18} /> ذخیره همه تغییرات
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
