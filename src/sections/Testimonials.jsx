import { testimonials } from '../data/profile';
import { externalProps } from '../lib/links';

// Hidden until real recommendations are added to `testimonials` in src/data/profile.js.
export default function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="section">
      <div className="wrap">
        <span className="tag">Recommendations</span>
        <h2 className="h2" data-reveal="">What colleagues and clients say</h2>
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
