const cities = [
  ["تهران",48,28],["تبریز",24,20],["ارومیه",16,25],["اردبیل",32,17],["رشت",38,18],["ساری",55,19],
  ["گرگان",65,21],["مشهد",83,28],["بجنورد",76,21],["سمنان",61,32],["قزوین",41,27],["کرج",45,27],
  ["قم",48,36],["اراک",42,43],["همدان",34,39],["زنجان",32,28],["سنندج",25,35],["کرمانشاه",25,43],
  ["ایلام",22,51],["خرم‌آباد",32,51],["اهواز",29,62],["شهرکرد",42,55],["اصفهان",50,50],["یاسوج",42,64],
  ["شیراز",49,71],["بوشهر",38,75],["یزد",63,53],["کرمان",68,67],["بندرعباس",65,85],["زاهدان",86,66],["بیرجند",81,47],
] as const;

export function IranMap() {
  return <section className="map-section">
    <div className="map-copy"><span className="eyebrow">یک شبکه، به وسعت ایران</span><h2>هر نقطه، یک فرصت<br/>برای رشد و آبادانی</h2><p>از شمال تا جنوب، کنار تولیدکنندگان و همراهان محلی هستیم تا هیچ ظرفیت ارزشمندی دور از نگاه نماند.</p><div className="map-stat"><b>۳۱</b><span>استان در مسیر همراهی</span></div></div>
    <div className="map-wrap" aria-label="نقشه مراکز استان‌های ایران">
      <svg viewBox="0 0 100 100" role="img">
        <defs><linearGradient id="iranFill" x1="0" x2="1"><stop stopColor="#e9dfc5"/><stop offset="1" stopColor="#c9d7b7"/></linearGradient></defs>
        <path className="iran" d="M10 21 L20 12 32 11 42 16 52 13 62 18 76 18 91 30 88 42 94 50 89 58 92 72 82 77 75 91 64 89 58 78 48 79 41 72 29 67 24 57 15 54 18 43 9 36Z"/>
        <path className="province-lines" d="M20 13l5 27m7-29l8 33m3-28l-3 57m13-59l-2 65m11-61l-5 70m19-70L66 88M17 42l72 1M23 56l66 3M34 68l48 9"/>
        {cities.map(([name, x, y], index) => <g key={name} className="city" style={{ animationDelay: `${index * .18}s` }}><circle className="pulse" cx={x} cy={y} r="2.8"/><circle cx={x} cy={y} r="1.25"/><text x={x} y={y - 3.5}>{name}</text></g>)}
      </svg>
    </div>
  </section>;
}
