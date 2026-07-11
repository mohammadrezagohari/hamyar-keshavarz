# کشاورز‌یار

لندینگ فارسی و راست‌چین برای ارتباط کشاورزان محلی با متقاضیان همکاری و مشارکت. محتوای بنر و مراحل همکاری از پنل مدیریت قابل ویرایش است و درخواست‌های کاربران در دیتابیس ذخیره می‌شوند.

## امکانات

- لندینگ واکنش‌گرا برای موبایل، تبلت و دسکتاپ
- بنر و سه مرحله همکاری با محتوای داینامیک
- فرم دوحالته برای:
  - کشاورزان: نام، شماره تماس، روستا/منطقه و محصول
  - متقاضیان همکاری: نام، شماره تماس و زمینه همکاری
- اعتبارسنجی شماره موبایل ایران
- ذخیره و مدیریت درخواست‌ها در SQLite با Prisma
- پنل مدیریت محافظت‌شده با رمز عبور
- امکان مشاهده و حذف درخواست‌های ثبت‌شده
- نقشه SVG سبک ایران با نشانگر چشمک‌زن ۳۱ مرکز استان
- SEO شامل Metadata، canonical، Open Graph، JSON-LD، sitemap و robots
- کش ISR برای تحویل سریع‌تر صفحه اصلی
- پشتیبانی از RTL و تنظیمات کاهش حرکت سیستم‌عامل

## فناوری‌ها

- Next.js 15 با App Router و Server Actions
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Lucide React

## پیش‌نیازها

- Node.js نسخه 20 یا جدیدتر
- npm نسخه 10 یا جدیدتر

نسخه‌های نصب‌شده را بررسی کنید:

```bash
node --version
npm --version
```

## راه‌اندازی محلی

### ۱. نصب وابستگی‌ها

```bash
npm install
```

در PowerShell ویندوز، اگر اجرای `npm.ps1` محدود شده است از `npm.cmd` استفاده کنید:

```powershell
npm.cmd install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.example` را با نام `.env` کپی کنید:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-secure-admin-password"
SESSION_SECRET="your-long-random-session-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

شرح متغیرها:

| متغیر | کاربرد |
| --- | --- |
| `DATABASE_URL` | مسیر دیتابیس SQLite؛ مسیر نسبی از پوشه `prisma` محاسبه می‌شود. |
| `ADMIN_PASSWORD` | رمز ورود به پنل مدیریت. |
| `SESSION_SECRET` | مقدار تصادفی و طولانی برای ساخت نشست امن مدیریت. |
| `NEXT_PUBLIC_SITE_URL` | آدرس کامل سایت برای canonical، sitemap و داده‌های SEO. |

### ساخت `SESSION_SECRET` امن

`SESSION_SECRET` باید یک مقدار طولانی، تصادفی و غیرقابل‌حدس باشد. این مقدار برای ساخت توکن نشست پنل مدیریت استفاده می‌شود و نباید عبارتی مانند رمز عبور، نام پروژه یا مقدار نمونه README باشد.

روش پیشنهادی که روی ویندوز، لینوکس و macOS و با Node.js کار می‌کند:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

خروجی یک رشته تصادفی ۶۴ کاراکتری است. نمایش کوتاه‌شده آن شبیه این خواهد بود:

```text
8f2a1c7b...91cd
```

خروجی واقعی دستور را بدون فاصله یا تغییر در فایل `.env` قرار دهید:

```env
SESSION_SECRET="خروجی-کامل-دستور-بالا"
```

اگر OpenSSL روی سیستم نصب است، می‌توانید از این دستور هم استفاده کنید:

```bash
openssl rand -hex 32
```

روش PowerShell بدون نیاز به OpenSSL:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[System.Convert]::ToHexString($bytes).ToLower()
```

نکات امنیتی:

- برای development و production از secretهای جداگانه استفاده کنید.
- مقدار تولیدشده را داخل Git، README، پیام‌رسان یا logها قرار ندهید.
- فایل `.env` را commit نکنید؛ این فایل از قبل در `.gitignore` قرار دارد.
- اگر secret افشا شد، فوراً مقدار جدید بسازید. با تغییر آن، نشست‌های مدیریت قبلی نامعتبر می‌شوند.
- پس از تغییر `SESSION_SECRET`، سرور Next.js را restart کنید.

برای production از مقادیر نمونه یا رمز پیش‌فرض استفاده نکنید.

### ۳. تولید Prisma Client

```bash
npm run db:generate
```

### ۴. ایجاد یا به‌روزرسانی دیتابیس

```bash
npm run db:push
```

### ۵. درج محتوای اولیه

```bash
npm run db:seed
```

Seed، محتوای اولیه بنر و سه مرحله همکاری را ایجاد می‌کند. اجرای دوباره آن اطلاعات موجود را حذف نمی‌کند.

### ۶. اجرای محیط توسعه

```bash
npm run dev
```

سپس این آدرس‌ها در دسترس هستند:

- لندینگ: [http://localhost:3000](http://localhost:3000)
- ورود مدیریت: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- پنل مدیریت: [http://localhost:3000/admin](http://localhost:3000/admin)

## دستورات پروژه

| دستور | توضیح |
| --- | --- |
| `npm run dev` | اجرای سرور توسعه Next.js |
| `npm run build` | ساخت نسخه production |
| `npm run start` | اجرای build تولیدی |
| `npm run db:generate` | تولید Prisma Client پس از تغییر schema |
| `npm run db:push` | هماهنگ‌کردن schema با دیتابیس |
| `npm run db:seed` | درج محتوای اولیه سایت |

## اجرای production

ابتدا دامنه واقعی و رمزهای امن را در `.env` تنظیم کنید:

```env
NEXT_PUBLIC_SITE_URL="https://example.ir"
ADMIN_PASSWORD="a-strong-password"
SESSION_SECRET="a-long-and-random-secret"
```

سپس:

```bash
npm run build
npm run start
```

به‌صورت پیش‌فرض سرور روی پورت `3000` اجرا می‌شود. برای تغییر پورت:

```bash
npm run start -- -p 4000
```

## استفاده از پنل مدیریت

1. به مسیر `/admin/login` بروید.
2. مقدار `ADMIN_PASSWORD` را وارد کنید.
3. در بخش «درخواست‌ها»، اطلاعات فرم‌های ثبت‌شده را مشاهده یا حذف کنید.
4. در بخش «محتوای سایت»، متن بنر و هر سه مرحله را ویرایش کنید.
5. دکمه «ذخیره همه تغییرات» را بزنید.

پس از ذخیره محتوا، کش صفحه اصلی با `revalidatePath` پاک می‌شود و نسخه جدید در بازدید بعدی نمایش داده خواهد شد.

نشست مدیریت با cookie از نوع `HttpOnly` و `SameSite=Lax` نگهداری می‌شود و در production ویژگی `Secure` نیز فعال است. مدت نشست ۸ ساعت است.

## مدل‌های دیتابیس

### `SiteContent`

محتوای بنر اصلی شامل بالانویس، عنوان، توضیحات و متن دکمه.

### `Stage`

عنوان و توضیحات سه مرحله همکاری، مرتب‌شده با شماره مرحله.

### `Submission`

درخواست کشاورز یا متقاضی همکاری، شامل اطلاعات تماس و فیلدهای متناسب با نوع درخواست.

Schema کامل در فایل [`prisma/schema.prisma`](prisma/schema.prisma) قرار دارد.

## ساختار پروژه

```text
app/
├── admin/
│   ├── login/page.tsx       # صفحه ورود مدیریت
│   └── page.tsx             # داشبورد مدیریت
├── actions.ts               # Server Actionهای فرم، ورود و مدیریت محتوا
├── globals.css              # استایل لندینگ و پنل
├── layout.tsx               # Layout و Metadata اصلی
├── manifest.ts              # Web App Manifest
├── page.tsx                 # صفحه اصلی
├── robots.ts                # قوانین crawlerها
└── sitemap.ts               # نقشه سایت
components/
├── IranMap.tsx              # نقشه SVG و مراکز استان‌ها
└── LeadForm.tsx             # فرم تعاملی دوحالته
lib/
├── auth.ts                  # نشست و کنترل دسترسی مدیریت
└── prisma.ts                # نمونه مشترک Prisma Client
prisma/
├── schema.prisma            # مدل‌های دیتابیس
└── seed.ts                  # محتوای اولیه
```

## SEO و عملکرد

- صفحه اصلی به‌صورت ISR ساخته می‌شود و هر یک ساعت قابلیت بازسازی دارد.
- تغییر محتوا از پنل باعث invalidation فوری کش می‌شود.
- فونت یا تصویر خارجی مسدودکننده در لندینگ وجود ندارد.
- بخش‌های خارج از viewport با `content-visibility` دیرتر paint می‌شوند.
- عنوان، توضیحات، canonical و Open Graph در `app/layout.tsx` تعریف شده‌اند.
- اطلاعات سازمان به‌صورت JSON-LD در صفحه اصلی قرار دارد.
- مسیرهای `/robots.txt`، `/sitemap.xml` و `/manifest.webmanifest` خودکار تولید می‌شوند.
- مسیر مدیریت در `robots.txt` از ایندکس‌شدن منع شده است.

پس از تنظیم دامنه production، این موارد را بررسی کنید:

```text
https://example.ir/robots.txt
https://example.ir/sitemap.xml
https://example.ir/manifest.webmanifest
```

## نکات مهم استقرار و دیتابیس

SQLite برای توسعه محلی و سرورهایی با دیسک دائمی مناسب است. در پلتفرم‌های serverless با filesystem موقت یا فقط‌خواندنی، مانند بسیاری از تنظیمات Vercel، نباید روی فایل SQLite محلی برای نگهداری دائمی درخواست‌ها حساب کرد.

برای production serverless بهتر است datasource به PostgreSQL تغییر داده شود و از سرویس‌هایی مانند Neon، Supabase یا یک PostgreSQL مدیریت‌شده استفاده شود. پس از تغییر provider و `DATABASE_URL` باید migration مناسب محیط production ایجاد و اجرا شود.

فایل `.env` و دیتابیس محلی در Git قرار نمی‌گیرند. از commit کردن رمزها یا فایل `prisma/dev.db` خودداری کنید.

## خطاهای رایج

### خطای `EPERM` هنگام `prisma generate`

نمونه خطا:

```text
EPERM: operation not permitted, rename ... query_engine-windows.dll.node.tmp...
```

یک پردازش فعال Next.js فایل Prisma را در ویندوز قفل کرده است. سرورهای `npm run dev` یا `npm run start` را با `Ctrl+C` متوقف کنید و سپس اجرا کنید:

```bash
npm run db:generate
```

بعد از پایان generate می‌توانید سرور را دوباره اجرا کنید.

### خطای PowerShell برای `npm.ps1`

اگر PowerShell اجازه اجرای اسکریپت npm را نمی‌دهد، بدون تغییر Execution Policy از نسخه cmd استفاده کنید:

```powershell
npm.cmd run dev
npm.cmd run build
```

### صفحه درخواست اجرای seed را نشان می‌دهد

دیتابیس محتوای اولیه ندارد. این دستورات را اجرا کنید:

```bash
npm run db:push
npm run db:seed
```

### تغییرات پنل در سایت نمایش داده نمی‌شوند

یک بار صفحه را refresh کنید. Server Action پنل کش مسیر `/` را invalidate می‌کند؛ در استقرار چندسروری باید همه instanceها به دیتابیس مشترک متصل باشند.

## بررسی قبل از انتشار

- [ ] `ADMIN_PASSWORD` تغییر کرده است.
- [ ] `SESSION_SECRET` یک مقدار امن و تصادفی دارد.
- [ ] `NEXT_PUBLIC_SITE_URL` روی دامنه نهایی تنظیم شده است.
- [ ] دیتابیس production دائمی و backup‌پذیر است.
- [ ] دستورات `db:generate` و `db:push` با موفقیت اجرا شده‌اند.
- [ ] `npm run build` بدون خطا تمام می‌شود.
- [ ] فرم کشاورز و فرم همکاری آزمایش شده‌اند.
- [ ] ورود، ویرایش محتوا و حذف درخواست در پنل بررسی شده‌اند.
- [ ] `robots.txt` و `sitemap.xml` با دامنه صحیح پاسخ می‌دهند.

## مجوز

این پروژه در حال حاضر مجوز عمومی مشخصی ندارد و استفاده یا انتشار آن تابع تصمیم مالک پروژه است.
