import { Handshake, Lightbulb, Wheat } from "lucide-react";

type CoreValue = {
  id: number;
  order: number;
  title: string;
  description: string;
  iconImageUrl: string | null;
};

const icons = [Wheat, Lightbulb, Handshake] as const;

export function ValuesSection({
  title,
  tagline,
  values,
}: {
  title: string;
  tagline: string;
  values: CoreValue[];
}) {
  return (
    <section className="values-section" aria-labelledby="values-title">
      <div className="values-heading">
        <span className="eyebrow">آنچه به آن باور داریم</span>
        <h2 id="values-title">{title}</h2>
        <p>{tagline}</p>
      </div>
      <div className="values-grid">
        {values.map((item, index) => {
          const Icon = icons[index] || Wheat;
          const points = item.description.split(/\r?\n/).filter(Boolean);
          return (
            <article key={item.id}>
              <div className="value-title">
                <span>
                  {item.iconImageUrl
                    ? <img src={item.iconImageUrl} alt="" />
                    : <Icon size={34} strokeWidth={1.7} aria-hidden="true" />}
                </span>
                <h3>{item.title}</h3>
              </div>
              <ul>
                {points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
