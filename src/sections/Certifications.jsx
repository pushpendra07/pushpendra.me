import TechIcon from '../components/TechIcon';
import { certs, education } from '../data/profile';
import { externalProps } from '../lib/links';

export default function Certifications() {
  return (
    <section id="certifications" className="certs">
      <div className="container certs-grid">
        <div className="heading" data-reveal="">
          <span className="eyebrow">CERTIFICATIONS</span>
          <h2 className="h2">Certified and recognised.</h2>
        </div>
        <div className="certs-side">
          <div className="cert-list">
            {certs.map((c) => (
              <div key={c.n} className="cert" data-reveal="">
                {c.badge ? (
                  <img src={c.badge} alt={`${c.title} badge`} className="cert-badge" width="64" height="64" loading="lazy" />
                ) : (
                  <span className="cert-icon"><TechIcon name={c.icon} color="currentColor" /></span>
                )}
                <h3 className="cert-title">{c.title}</h3>
                <span className="cert-issuer">{c.issuer}</span>
                <span className="cert-meta">{c.meta}</span>
                {c.verifyUrl && (
                  <a href={c.verifyUrl} className="cert-verify" {...externalProps(true)}>Verify credential ↗</a>
                )}
              </div>
            ))}
          </div>
          <p className="edu-line" data-reveal="">
            <span className="edu-label">Education</span>
            {education.map((ed, i) => (
              <span key={ed.degree}>
                {i > 0 && <span className="edu-sep" aria-hidden="true"> · </span>}
                <abbr title={ed.degree}>{ed.short}</abbr>, {ed.school}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
