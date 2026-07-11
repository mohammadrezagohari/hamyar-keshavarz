import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      heroEyebrow: "از دل خاک، برای فردای ایران",
      heroTitle: "پیوند کشاورزان محلی با فرصت‌های بزرگ",
      heroDescription: "کشاورز‌یار پلی است میان تولیدکنندگان پرتلاش و کسانی که می‌خواهند در رشد پایدار روستاهای ایران سهیم باشند.",
      heroCta: "به ما بپیوندید",
    },
  });

  const stages = [
    [1, "معرفی و ثبت اطلاعات", "محصول، ظرفیت روستا یا زمینه همکاری خود را در چند دقیقه برای ما ثبت کنید."],
    [2, "بررسی و برقراری ارتباط", "تیم کشاورز‌یار اطلاعات را بررسی می‌کند و افراد و فرصت‌های مناسب را به هم متصل می‌کند."],
    [3, "رشد و همراهی پایدار", "همکاری آغاز می‌شود و از شکل‌گیری ارتباط تا رسیدن به نتیجه در کنار شما می‌مانیم."],
  ] as const;

  for (const [number, title, description] of stages) {
    await prisma.stage.upsert({ where: { number }, update: {}, create: { number, title, description } });
  }
}

main().finally(() => prisma.$disconnect());
