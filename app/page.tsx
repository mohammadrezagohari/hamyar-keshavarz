import { ArrowDown, MoveLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LeadForm } from "@/components/LeadForm";
import { IranMap } from "@/components/IranMap";
import { SponsorsStrip } from "@/components/SponsorsStrip";

// The landing page is cached and regenerated after CMS updates via revalidatePath.
export const revalidate = 3600;

const persianStepNumber = new Intl.NumberFormat("fa-IR", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

export default async function Home() {
  const [content, stages, locations, sponsors] = await Promise.all([
    prisma.siteContent.findUnique({ where: { id: 1 } }),
    prisma.stage.findMany({ orderBy: { number: "asc" } }),
    prisma.province.findMany({ include: { cities: { orderBy: { name: "asc" } } }, orderBy: { name: "asc" } }),
    prisma.sponsor.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!content) return <main className="empty">ابتدا دستور <code>npm run db:seed</code> را اجرا کنید.</main>;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "کشاورزیار",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://hamyarkeshavarz.com",
    description: content.heroDescription,
    areaServed: { "@type": "Country", name: "Iran" },
    knowsAbout: ["کشاورزی", "محصولات روستایی", "توسعه پایدار روستا"],
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/>
    <nav aria-label="ناوبری اصلی"><a className="brand" href="#top" aria-label="همیار کشاورز، صفحه اصلی"><img src="/brand-logo.png" alt="همیار کشاورز" /></a><div><a href="#steps">مسیر همکاری</a><a href="#coverage">گستره فعالیت</a><a href="#story">داستان ما</a><a className="nav-cta" href="#join">همراه ما شوید <MoveLeft size={17} aria-hidden="true"/></a></div></nav>
    <header id="top" className="hero">
      <div className="hero-decor one" aria-hidden="true"/><div className="hero-decor two" aria-hidden="true"/>
      <div className="hero-content"><span className="eyebrow">{content.heroEyebrow}</span><h1>{content.heroTitle}</h1><p>{content.heroDescription}</p><a className="hero-cta" href="#join">{content.heroCta}<ArrowDown size={20}/></a></div>
      {content.heroImageUrl ? (
        <div className="hero-art uploaded" aria-hidden="true" style={{ backgroundImage: `url(${content.heroImageUrl})` }} />
      ) : (
        <div className="hero-art" aria-hidden="true"><div className="sun"/><div className="field f1"/><div className="field f2"/><div className="field f3"/><div className="plant"><i/><i/><i/><i/><b/></div></div>
      )}
      <div className="scroll">برای کشف بیشتر اسکرول کنید <ArrowDown size={15}/></div>
    </header>
    <section id="steps" className="steps"><div className="section-title"><span className="eyebrow">ساده، شفاف و همراهانه</span><h2>مسیر ما در سه قدم</h2><p>از اولین آشنایی تا ساختن یک همکاری ماندگار، قدم‌به‌قدم کنار هم پیش می‌رویم.</p></div><div className="steps-grid">{stages.map((stage, index) => <article key={stage.id}><div className="step-no">{persianStepNumber.format(stage.number)}</div>{stage.iconImageUrl && <div className="step-icon"><img src={stage.iconImageUrl} alt="" /></div>}<h3>{stage.title}</h3><p>{stage.description}</p>{index < stages.length - 1 && <span className="connector">••••••••</span>}</article>)}</div></section>
    <section id="join" className="join"><LeadForm locations={locations}/></section>
    <div id="coverage"><IranMap content={{ eyebrow: content.mapEyebrow, title: content.mapTitle, description: content.mapDescription, statNumber: content.mapStatNumber, statLabel: content.mapStatLabel, caption: content.mapCaption }}/></div>
    {content.showSponsors && <SponsorsStrip sponsors={sponsors}/>}
    <section className="story" aria-labelledby="story-title">
      <div className="story-inner">
        <span className="eyebrow" id="story">داستان ما</span>
        <div className="story-card">
          <h2 id="story-title">{content.storyTitle}</h2>
          <p>{content.storyContent}</p>
        </div>
      </div>
    </section>
    <footer><a className="brand" href="#top" aria-label="همیار کشاورز، بازگشت به بالای صفحه"><img src="/brand-logo.png" alt="همیار کشاورز" /></a><p>با هم برای آبادانی روستاها و آینده‌ای سبزتر تلاش می‌کنیم.</p><a href="/admin" rel="nofollow">ورود مدیریت</a></footer>
  </main>;
}
