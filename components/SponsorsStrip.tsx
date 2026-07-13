const sponsors = [
  { name: "بانک کشاورزی", label: "بک", href: "#" },
  { name: "صندوق توسعه روستایی", label: "صت", href: "#" },
  { name: "اتاق بازرگانی", label: "اب", href: "#" },
  { name: "شتاب‌دهنده روستا", label: "شر", href: "#" },
  { name: "تعاونی تولید", label: "تت", href: "#" },
];

export function SponsorsStrip() {
  return (
    <section className="sponsors" aria-labelledby="sponsors-title">
      <div className="sponsors-inner">
        <div>
          <span className="eyebrow">حامیان کار</span>
          <h2 id="sponsors-title">همراهان مسیر کشاورزیار</h2>
        </div>
        <div className="sponsor-list">
          {sponsors.map((sponsor) => (
            <a key={sponsor.name} href={sponsor.href} aria-label={sponsor.name} className="sponsor-logo">
              <span>{sponsor.label}</span>
              <b>{sponsor.name}</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
