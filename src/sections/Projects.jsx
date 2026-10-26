import { useState } from 'react';
import { projectFilters, projects } from '../data/profile';
import { caseStudyPath, clientName } from '../lib/projects';

const FILTERS = [['all', 'All projects'], ...projectFilters];
const countFor = (key) => (key === 'all' ? projects.length : projects.filter((pj) => pj.focus.includes(key)).length);

// Moves the card's glow to follow the pointer.
function spotlight(e) {
  const card = e.target.closest('.project');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const shown = (pj) => filter === 'all' || pj.focus.includes(filter);
  const label = FILTERS.find(([key]) => key === filter)[1];

  return (
    <section id="projects" className="projects">
      <div className="container section-stack">
        <div className="projects-head" data-reveal="">
          <div className="heading" style={{ maxWidth: 640 }}>
            <span className="eyebrow eyebrow--dark">PROJECTS</span>
            <h2 className="h2" style={{ color: '#fff' }}>Commerce problems, engineered properly.</h2>
          </div>
          <p className="projects-intro">
            Twelve client platforms across the Middle East, Australia, Russia and the USA — from omnichannel grocery
            to headless PWA storefronts and B2B quoting. Each one opens a full case study.
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filter projects" data-reveal="">
          {FILTERS.map(([key, name]) => (
            <button
              key={key}
              type="button"
              className={`filter${filter === key ? ' is-active' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {name}<span className="filter-count">{countFor(key)}</span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {filter === 'all' ? `Showing all ${projects.length} projects` : `Showing ${countFor(filter)} ${label} projects`}
        </p>

        <div className="project-grid" onPointerMove={spotlight}>
          {projects.map((pj, i) => (
            <article key={pj.n} className="project" hidden={!shown(pj)} data-reveal="" data-delay={(i % 3) * 110}>
              <div className="project-top">
                <span className="project-cat">{pj.category}</span>
              </div>
              <h3 className="project-title">
                {/* Stretched link: the whole card opens the case study. */}
                <a href={caseStudyPath(pj)} className="project-link">{clientName(pj)}</a>
              </h3>
              <p className="project-desc">{pj.desc}</p>
              <div className="tags">
                {pj.tags.map((tg) => <span key={tg} className="tag-dark">{tg}</span>)}
              </div>
              <span className="project-cta" aria-hidden="true">Read case study →</span>
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
