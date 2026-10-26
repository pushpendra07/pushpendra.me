import { skills } from '../data/profile';

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="container section-stack">
        <div className="heading" data-reveal="" style={{ maxWidth: 640 }}>
          <span className="eyebrow">04 — SKILLS</span>
          <h2 className="h2">The toolkit.</h2>
        </div>
        <div className="skill-grid">
          {skills.map((sk, i) => (
            <div key={sk.group} className={`skill-card${sk.learning ? ' skill-card--learning' : ''}`} data-reveal="" data-delay={i * 90}>
              <div className="skill-head">
                <h3 className="skill-group">{sk.group}</h3>
                <span className="skill-count">{String(sk.items.length).padStart(2, '0')}</span>
              </div>
              {sk.note && <p className="skill-note">{sk.note}</p>}
              <ul className="skill-items">
                {sk.items.map((it) => <li key={it} className="skill-item">{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
