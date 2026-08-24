import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Location names are adapted from https://github.com/sajaddp/list-of-cities-in-Iran.
// Keep these names user-facing because submissions store the selected labels.
const iranLocations = [
  ["آذربایجان شرقی", ["تبریز", "مراغه", "مرند", "میانه", "اهر", "بناب", "سراب", "شبستر", "عجب شیر", "هریس", "ملکان", "آذرشهر"]],
  ["آذربایجان غربی", ["ارومیه", "خوی", "میاندوآب", "مهاباد", "سلماس", "بوکان", "نقده", "پیرانشهر", "ماکو", "اشنویه", "تکاب", "شاهین دژ"]],
  ["اردبیل", ["اردبیل", "پارس آباد", "مشگین شهر", "خلخال", "گرمی", "نمین", "بیله سوار", "کوثر", "نیر"]],
  ["اصفهان", ["اصفهان", "کاشان", "نجف آباد", "خمینی شهر", "شاهین شهر", "شهرضا", "گلپایگان", "نائین", "اردستان", "فلاورجان", "مبارکه", "خوانسار"]],
  ["البرز", ["کرج", "فردیس", "نظرآباد", "ساوجبلاغ", "اشتهارد", "طالقان", "چهارباغ"]],
  ["ایلام", ["ایلام", "دهلران", "آبدانان", "ایوان", "دره شهر", "مهران", "چرداول", "ملکشاهی"]],
  ["بوشهر", ["بوشهر", "دشتستان", "کنگان", "گناوه", "دشتی", "تنگستان", "جم", "دیر", "عسلویه", "دیلم"]],
  ["تهران", ["تهران", "ری", "شمیرانات", "اسلامشهر", "شهریار", "ملارد", "قدس", "رباط کریم", "ورامین", "پاکدشت", "دماوند", "فیروزکوه"]],
  ["چهارمحال و بختیاری", ["شهرکرد", "بروجن", "لردگان", "فارسان", "اردل", "کوهرنگ", "کیار", "سامان", "بن"]],
  ["خراسان جنوبی", ["بیرجند", "قائنات", "طبس", "فردوس", "نهبندان", "سربیشه", "درمیان", "سرایان", "بشرویه", "خوسف"]],
  ["خراسان رضوی", ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه", "قوچان", "کاشمر", "تایباد", "چناران", "سرخس", "گناباد", "خواف", "فریمان"]],
  ["خراسان شمالی", ["بجنورد", "شیروان", "اسفراین", "مانه و سملقان", "جاجرم", "فاروج", "گرمه", "راز و جرگلان"]],
  ["خوزستان", ["اهواز", "دزفول", "آبادان", "خرمشهر", "ماهشهر", "بهبهان", "اندیمشک", "شوشتر", "ایذه", "شوش", "رامهرمز", "شادگان"]],
  ["زنجان", ["زنجان", "ابهر", "خرمدره", "قیدار", "ماهنشان", "طارم", "ایجرود", "سلطانیه"]],
  ["سمنان", ["سمنان", "شاهرود", "دامغان", "گرمسار", "مهدی شهر", "سرخه", "آرادان", "میامی"]],
  ["سیستان و بلوچستان", ["زاهدان", "زابل", "چابهار", "ایرانشهر", "خاش", "سراوان", "نیک شهر", "کنارک", "سرباز", "زهک", "دلگان", "هیرمند"]],
  ["فارس", ["شیراز", "مرودشت", "کازرون", "جهرم", "فسا", "لارستان", "داراب", "آباده", "اقلید", "نی ریز", "استهبان", "ممسنی"]],
  ["قزوین", ["قزوین", "البرز", "آبیک", "تاکستان", "بوئین زهرا", "آوج"]],
  ["قم", ["قم"]],
  ["کردستان", ["سنندج", "سقز", "مریوان", "بانه", "قروه", "کامیاران", "بیجار", "دیواندره", "دهگلان", "سروآباد"]],
  ["کرمان", ["کرمان", "رفسنجان", "سیرجان", "بم", "جیرفت", "زرند", "کهنوج", "بافت", "بردسیر", "شهربابک", "راور", "عنبرآباد"]],
  ["کرمانشاه", ["کرمانشاه", "اسلام آباد غرب", "سنقر", "هرسین", "کنگاور", "جوانرود", "پاوه", "سرپل ذهاب", "قصر شیرین", "روانسر", "گیلانغرب", "صحنه"]],
  ["کهگیلویه و بویراحمد", ["یاسوج", "گچساران", "دهدشت", "بهمئی", "چرام", "دنا", "لنده", "باشت"]],
  ["گلستان", ["گرگان", "گنبد کاووس", "علی آباد کتول", "آق قلا", "کردکوی", "مینودشت", "آزادشهر", "کلاله", "رامیان", "بندر ترکمن", "گمیشان"]],
  ["گیلان", ["رشت", "انزلی", "لاهیجان", "لنگرود", "رودسر", "تالش", "آستارا", "صومعه سرا", "فومن", "رودبار", "ماسال", "املش"]],
  ["لرستان", ["خرم آباد", "بروجرد", "دورود", "الیگودرز", "کوهدشت", "ازنا", "الشتر", "پلدختر", "نورآباد", "چگنی"]],
  ["مازندران", ["ساری", "بابل", "آمل", "قائم شهر", "بهشهر", "تنکابن", "نوشهر", "چالوس", "بابلسر", "نور", "محمودآباد", "رامسر"]],
  ["مرکزی", ["اراک", "ساوه", "خمین", "محلات", "دلیجان", "تفرش", "آشتیان", "شازند", "زرندیه", "کمیجان"]],
  ["هرمزگان", ["بندرعباس", "میناب", "بندر لنگه", "قشم", "رودان", "حاجی آباد", "جاسک", "پارسیان", "بستک", "خمیر", "سیریک"]],
  ["همدان", ["همدان", "ملایر", "نهاوند", "تویسرکان", "کبودرآهنگ", "رزن", "اسدآباد", "بهار", "فامنین"]],
  ["یزد", ["یزد", "میبد", "اردکان", "ابرکوه", "بافق", "مهریز", "تفت", "اشکذر", "خاتم", "بهاباد"]],
] as const;

async function seedLocations() {
  for (const [provinceName, cities] of iranLocations) {
    const province = await prisma.province.upsert({
      where: { name: provinceName },
      update: {},
      create: { name: provinceName },
    });

    for (const cityName of cities) {
      await prisma.city.upsert({
        where: { provinceId_name: { provinceId: province.id, name: cityName } },
        update: {},
        create: { name: cityName, provinceId: province.id },
      });
    }
  }
}

const siteContent = {
  id: 1,
  heroEyebrow: "از دل خاک، برای فردای ایران",
  heroTitle: "پیوند کشاورزان محلی با فرصت‌های بزرگ",
  heroDescription: "کشاورز‌یار پلی است میان تولیدکنندگان پرتلاش و کسانی که می‌خواهند در رشد پایدار روستاهای ایران سهیم باشند.",
  heroCta: "به ما بپیوندید",
  heroImageUrl: "/uploads/0aed3170-f9bb-4da1-8033-018063720e3c.webp",
  showSponsors: true,
  valuesTitle: "ارزش‌های ما",
  valuesTagline: "تقویت ریشه‌هایمان | پرورش انگیزه‌مان | رسیدن به هدف واقعی‌مان",
  mapEyebrow: "یک شبکه، به وسعت ایران",
  mapTitle: "هر نقطه، یک فرصت\r\nبرای رشد و آبادانی",
  mapDescription: "از شمال تا جنوب، کنار تولیدکنندگان و همراهان محلی هستیم تا هیچ ظرفیت ارزشمندی دور از نگاه نماند.",
  mapStatNumber: "۳۱",
  mapStatLabel: "استان در مسیر همراهی",
  mapCaption: "ایران سرزمین مردان آزاد",
  storyTitle: "کشاورزیار این‌طوری شروع شد که",
  storyContent: "کشاورزیار از یک باور ساده شکل گرفت؛ اینکه ظرفیت‌های ارزشمند روستاهای ایران، شایسته دیده‌شدن و رشد هستند. ما تلاش می‌کنیم میان کشاورزان پرتلاش و همراهانی که دغدغه آبادانی دارند، پلی مطمئن و ماندگار بسازیم.",
  updatedAt: new Date("2026-08-07T20:39:58.236Z"),
};

const stages = [
  {
    number: 1,
    title: "معرفی و ثبت اطلاعات",
    description: "محصول، ظرفیت روستا یا زمینه همکاری خود را در چند دقیقه برای ما ثبت کنید.",
    iconImageUrl: null,
  },
  {
    number: 2,
    title: "بررسی و برقراری ارتباط",
    description: "تیم کشاورز‌یار اطلاعات را بررسی می‌کند و افراد و فرصت‌های مناسب را به هم متصل می‌کند.",
    iconImageUrl: null,
  },
  {
    number: 3,
    title: "رشد و همراهی پایدار",
    description: "همکاری آغاز می‌شود و از شکل‌گیری ارتباط تا رسیدن به نتیجه در کنار شما می‌مانیم.",
    iconImageUrl: null,
  },
] as const;

const coreValues = [
  {
    order: 1,
    title: "کشاورز اول",
    description: "نیازهای کشاورزان را بر هر چیز دیگری مقدم داشتن.\nبرای یافتن راه‌های نوآورانه جهت توانمندسازی کشاورزان.\nفراتر رفتن از مرزها برای ارائه راه‌حل‌هایی برای مشکلات کشاورزان.",
  },
  {
    order: 2,
    title: "نوآوری و خلاقیت",
    description: "برای همکاری بدون سلسله مراتب.\nداشتن اشتیاق برای حل مسئله.\nبرای به چالش کشیدن وضع موجود و تمرکز بر بهبود مستمر خودمان.",
  },
  {
    order: 3,
    title: "احترام",
    description: "برای حفظ استقلال این سازمان.\nتا پاسخگوی اعمال باشیم.\nبرای ترویج تنوع و ایجاد فرهنگ کاری عادلانه و فراگیر.",
  },
] as const;

const mapProjects = [
  {
    order: 1,
    title: "توسعه باغ‌های مرکبات شمال",
    description: "همراهی با باغداران محلی برای بهبود کیفیت محصول و ایجاد مسیر پایدار عرضه به بازار.",
    status: "در حال اجرا",
  },
  {
    order: 2,
    title: "زنجیره تأمین محصولات روستایی",
    description: "اتصال مستقیم تولیدکنندگان روستایی به ظرفیت‌های فروش و همکاری در سراسر کشور.",
    status: "در مرحله توسعه",
  },
  {
    order: 3,
    title: "توانمندسازی کشاورزان محلی",
    description: "شناسایی نیازهای واقعی کشاورزان و طراحی راهکارهای اجرایی متناسب با هر منطقه.",
    status: "در حال بررسی",
  },
] as const;

const sponsors = [
  { order: 1, name: "تیم نرم افزاری گندم", label: "گندم", href: "https://gandom.link", imageUrl: "/uploads/ddde3f9a-47d7-436b-bd23-a7b168581775.png" },
  { order: 2, name: "پزشک آموز", label: "صت", href: "#", imageUrl: "/uploads/a567ac4e-6842-433b-b15a-91b3af87f4fd.png" },
  { order: 3, name: "دانشگاه علوم پزشکی", label: "علوم", href: "https://google.com", imageUrl: "/uploads/87024cc0-9b10-41ed-a173-b313ded26974.png" },
  { order: 4, name: "شتاب‌دهنده روستا", label: "شر", href: "#", imageUrl: null },
  { order: 5, name: "تعاونی تولید", label: "تت", href: "#", imageUrl: null },
] as const;

const submissions = [
  { id: 1, type: "partner", name: "محمدرضا گوهری", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "سایر: تستی", createdAt: new Date("2026-07-14T12:08:00.538Z") },
  { id: 2, type: "farmer", name: "محمدرضا گوهری", phone: "09117184875", province: "مازندران", city: "ساری", village: "فرح آباد", product: "مرکبات", collaboration: null, createdAt: new Date("2026-07-14T12:08:59.834Z") },
  { id: 3, type: "farmer", name: "دانیال جاجیمی", phone: "09111571689", province: "مازندران", city: "ساری", village: "بالا دزا", product: "هلو", collaboration: null, createdAt: new Date("2026-07-14T12:13:35.868Z") },
  { id: 4, type: "partner", name: "mohammadreza gohari", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "خرید محصول", createdAt: new Date("2026-07-14T12:14:03.171Z") },
  { id: 5, type: "partner", name: "الکی", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "بازاریابی", createdAt: new Date("2026-07-14T12:19:58.215Z") },
  { id: 6, type: "partner", name: "تست", phone: "09371801145", province: null, city: null, village: null, product: null, collaboration: "صادرات", createdAt: new Date("2026-07-14T12:20:10.256Z") },
  { id: 7, type: "partner", name: "رفاد ایران", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "فرآوری و بسته بندی", createdAt: new Date("2026-07-14T12:20:18.282Z") },
  { id: 8, type: "partner", name: "دوره آموزشی", phone: "09117778889", province: null, city: null, village: null, product: null, collaboration: "بازاریابی", createdAt: new Date("2026-07-14T12:20:36.329Z") },
  { id: 9, type: "partner", name: "دوره پریمیر ودینگ", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "فرآوری و بسته بندی", createdAt: new Date("2026-07-14T12:20:52.578Z") },
  { id: 10, type: "partner", name: "mohammadreza", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "بازاریابی", createdAt: new Date("2026-07-14T12:20:58.275Z") },
  { id: 11, type: "partner", name: "دوره آموزشی", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "بازاریابی", createdAt: new Date("2026-07-14T12:21:03.375Z") },
  { id: 12, type: "partner", name: "Reza", phone: "09117184875", province: null, city: null, village: null, product: null, collaboration: "صادرات", createdAt: new Date("2026-07-14T12:21:09.765Z") },
] as const;

async function seedSponsors() {
  for (const sponsor of sponsors) {
    await prisma.sponsor.upsert({
      where: { order: sponsor.order },
      update: sponsor,
      create: sponsor,
    });
  }
}

async function seedSubmissions() {
  for (const submission of submissions) {
    await prisma.submission.upsert({
      where: { id: submission.id },
      update: submission,
      create: submission,
    });
  }
}

async function main() {
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: siteContent,
    create: siteContent,
  });

  for (const stage of stages) {
    await prisma.stage.upsert({ where: { number: stage.number }, update: stage, create: stage });
  }

  for (const coreValue of coreValues) {
    await prisma.coreValue.upsert({ where: { order: coreValue.order }, update: coreValue, create: coreValue });
  }

  for (const mapProject of mapProjects) {
    await prisma.mapProject.upsert({ where: { order: mapProject.order }, update: mapProject, create: mapProject });
  }

  await seedLocations();
  await seedSponsors();
  await seedSubmissions();
}

main().finally(() => prisma.$disconnect());
