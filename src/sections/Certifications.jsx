import { certs, education } from '../data/profile';

export default function Certifications() {
  return (
    <section id="certifications" className="certs">
      <div className="container certs-grid">
        <div className="heading" data-reveal="">
          <span className="eyebrow">05 — CERTIFICATIONS</span>
          <h2 className="h2">Certified and recognised.</h2>
          <ul className="education">
            {education.map((ed) => (
              <li key={ed.degree}>
                <span className="edu-degree">{ed.degree}</span>
                <span className="edu-school">{ed.school}</span>
                <span className="edu-dates">{ed.dates}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cert-list">
          {certs.map((c) => (
            <div key={c.n} className="cert" data-reveal="">
              <span className="cert-n">{c.n}</span>
              <h3 className="cert-title">{c.title}</h3>
              <span className="cert-issuer">{c.issuer}</span>
              <span className="cert-meta">{c.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
