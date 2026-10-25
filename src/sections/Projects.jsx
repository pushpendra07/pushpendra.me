import { projects } from '../data/profile';

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="container section-stack">
        <div className="projects-head" data-reveal="">
          <div className="heading" style={{ maxWidth: 640 }}>
            <span className="eyebrow eyebrow--dark">03 — PROJECTS</span>
            <h2 className="h2" style={{ color: '#fff' }}>Commerce problems, engineered properly.</h2>
          </div>
          <p className="projects-intro">
            Selected client work across the Middle East, Australia, Russia and the USA — from omnichannel grocery
            to headless PWA storefronts.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((pj, i) => (
            <article key={pj.n} className="project" data-reveal="" data-delay={(i % 3) * 110}>
              <div className="project-top">
                <span className="project-cat">{pj.category}</span>
                <span className="project-n">{pj.n}</span>
              </div>
              <h3 className="project-title">{pj.title}</h3>
              <p className="project-desc">{pj.desc}</p>
              <dl className="project-dl">
                <div><dt>Problem</dt><dd>{pj.problem}</dd></div>
                <div><dt>Solution</dt><dd>{pj.solution}</dd></div>
              </dl>
              <div className="tags">
                {pj.tags.map((tg) => <span key={tg} className="tag-dark">{tg}</span>)}
              </div>
              <div className="project-foot">
                <span className="project-impact">{pj.place}</span>
                <span className="project-soon">{pj.platform}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
