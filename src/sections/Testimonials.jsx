import { testimonials } from '../data/profile';
import { externalProps } from '../lib/links';

// Hidden until real recommendations are added to `testimonials` in src/data/profile.js.
export default function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="testimonials">
      <div className="container section-stack">
        <div className="heading" data-reveal="" style={{ maxWidth: 640 }}>
          <span className="eyebrow">RECOMMENDATIONS</span>
          <h2 className="h2">What colleagues and clients say.</h2>
        </div>
        <div className="quote-grid">
          {testimonials.map((t, i) => (
            <figure key={t.name} className="quote" data-reveal="" data-delay={(i % 3) * 100}>
              <blockquote><p>{t.quote}</p></blockquote>
              <figcaption>
                <span className="quote-name">
                  {t.url ? <a href={t.url} {...externalProps(true)}>{t.name}</a> : t.name}
                </span>
                <span className="quote-role">{t.role}</span>
                {t.relation && <span className="quote-relation">{t.relation}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
