type Sponsor = {
  id: number;
  name: string;
  label: string;
  href: string;
  imageUrl: string | null;
};

export function SponsorsStrip({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  return (
    <section className="sponsors" aria-labelledby="sponsors-title">
      <div className="sponsors-inner">
        <div>
          <span className="eyebrow">حامیان کار</span>
          <h2 id="sponsors-title">همراهان مسیر کشاورزیار</h2>
        </div>
        <div className="sponsor-list">
          {sponsors.map((sponsor) => (
            <a key={sponsor.id} href={sponsor.href || "#"} aria-label={sponsor.name} className="sponsor-logo">
              {sponsor.imageUrl ? <img src={sponsor.imageUrl} alt="" /> : <span>{sponsor.label}</span>}
              <b>{sponsor.name}</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
