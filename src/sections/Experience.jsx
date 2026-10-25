import { config, experience } from '../data/profile';

export default function Experience() {
  return (
    <section id="experience" className="experience">
      <div className="experience-inner">
        <div className="heading" data-reveal="" style={{ maxWidth: 680 }}>
          <span className="eyebrow">02 — EXPERIENCE</span>
          <h2 className="h2">Where I&apos;ve built.</h2>
          {config.showPlaceholderNotes && (
            <p className="note">
              Placeholder entries — replace with verified employers, titles and dates from the latest CV
              (src/data/profile.js).
            </p>
          )}
        </div>
        <ol className="timeline">
          {experience.map((ex, i) => (
            <li key={i} className="timeline-item" data-reveal="">
              <span className="timeline-dot" aria-hidden="true" />
              <article className="job">
                <div className="job-head">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <h3 className="job-title">{ex.title}</h3>
                    <span className="job-employer">{ex.employer}</span>
                  </div>
                  <span className="job-dates">{ex.dates}</span>
                </div>
                <ul className="job-points">
                  {ex.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
                <div className="tags">
                  {ex.stack.map((tg) => <span key={tg} className="tag-light">{tg}</span>)}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
