import { products } from '../data/profile';
import { caseStudyPath } from '../lib/projects';

// Moves the card's glow to follow the pointer.
function spotlight(e) {
  const card = e.target.closest('.project');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function AiBuilds() {
  return (
    <section id="ai-builds" className="projects ai-builds">
      <div className="container section-stack">
        <div className="projects-head" data-reveal="">
          <div className="heading" style={{ maxWidth: 640 }}>
            <span className="eyebrow">AI BUILDS</span>
            <h2 className="h2">Full products, built with AI agents.</h2>
          </div>
          <p className="projects-intro">
            My own products, built end to end with AI coding agents. I set the product and the architecture, and I
            reviewed and tested every module. Each one opens a full case study.
          </p>
        </div>

        <div className="project-grid" onPointerMove={spotlight}>
          {products.map((pj, i) => (
            <article key={pj.slug} className="project" data-reveal="" data-delay={(i % 2) * 110}>
              {pj.cover && (
                <img className="project-cover" src={pj.cover} alt="" loading="lazy" decoding="async" width="1440" height="900" />
              )}
              <div className="project-top">
                <span className="project-cat">{pj.category}</span>
                <span className="ai-badge">Built with AI</span>
              </div>
              <h3 className="project-title">
                {/* Stretched link: the whole card opens the case study. */}
                <a href={caseStudyPath(pj)} className="project-link">{pj.title}</a>
              </h3>
              <p className="project-desc">{pj.desc}</p>
              <div className="tags">
                {pj.tags.map((tg) => <span key={tg} className="tag-dark">{tg}</span>)}
              </div>
              <span className="project-cta" aria-hidden="true">
                {pj.demoUrl ? 'Case study & live demo →' : 'Read case study →'}
              </span>
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
