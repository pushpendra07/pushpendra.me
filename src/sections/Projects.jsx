import { useState } from 'react';
import { featuredExport, featuredFlow, featuredStats, projectFilters, projects } from '../data/profile';
import { caseStudyPath, clientName } from '../lib/projects';
import { track } from '../lib/analytics';
import Place from '../components/Place';
import { MiniScene, sceneTitle } from '../components/ProjectScene';

const FILTERS = [['all', 'All projects'], ...projectFilters];
const countFor = (key) => (key === 'all' ? projects.length : projects.filter((pj) => pj.focus.includes(key)).length);

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const shown = (pj) => filter === 'all' || pj.focus.includes(filter);
  const label = FILTERS.find(([key]) => key === filter)[1];
  const [feat, ...rest] = projects;
  const visible = rest.filter(shown);

  return (
    <section id="projects" className="section">
      <div className="wrap">
        <span className="tag">Client work · {projects.length} platforms</span>
        <h2 className="h2" data-reveal="">From Dubai to Perth, <span className="accent">commerce platforms I&apos;ve built</span></h2>
        <p className="sub" data-reveal="">
          Grocery, toys, fashion, machinery and B2B stores for retailers in seven countries. Every figure comes
          from the project&apos;s case study.
        </p>

        <div className="filters" role="group" aria-label="Filter projects">
          {FILTERS.map(([key, name]) => (
            <button
              key={key}
              type="button"
              className={filter === key ? 'is-on' : ''}
              aria-pressed={filter === key}
              onClick={() => { setFilter(key); track('project_filter', { filter: key }); }}
            >
              {name}<span>{countFor(key)}</span>
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {filter === 'all' ? `Showing all ${projects.length} projects` : `Showing ${countFor(filter)} ${label} projects`}
        </p>

        <article className="feat" hidden={!shown(feat)} data-reveal="">
          <div className="feat-text">
            <Place place={`${feat.place} · ${feat.platform}`} />
            <span className="badge">Featured project</span>
            <h3>
              {/* Stretched link: the whole card opens the case study. */}
              <a href={caseStudyPath(feat)} className="card-link">{clientName(feat)}</a>
            </h3>
            <p>{feat.desc}</p>
            <div className="feat-stats">
              {featuredStats.map((s) => (
                <div key={s.kicker} className="stat-tile">
                  <span className="kicker">{s.kicker}</span>
                  <strong data-count="">{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
              <div className="stat-tile stat-wide">
                <div>
                  <span className="kicker">{featuredExport.kicker}</span>
                  <strong>{featuredExport.value}</strong>
                  <span>{featuredExport.label}</span>
                </div>
                <dl className="before-after">
                  <div><dt>Before</dt><dd><i className="bar bar-bad" /><b className="bad">{featuredExport.before}</b></dd></div>
                  <div><dt>After</dt><dd><i className="bar bar-good" /><b className="good">{featuredExport.after}</b></dd></div>
                </dl>
              </div>
            </div>
            <ul className="chips" aria-label="Technologies">
              {feat.tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <span className="go" aria-hidden="true">Read the full case study →</span>
          </div>
          <div className="flow" aria-label="How one order moves through the platform">
            <span className="flow-title">How one order moves</span>
            <ol>
              {featuredFlow.map(([what, where], i) => (
                <li key={what} style={{ '--i': i }}>
                  <i>{String(i + 1).padStart(2, '0')}</i>
                  <div><b>{what}</b><small>{where}</small></div>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <div className="wgrid">
          {rest.map((pj, i) => {
            const wide = visible.length % 2 === 1 && visible[visible.length - 1] === pj;
            return (
              <article key={pj.n} className={`wcard${wide ? ' wcard--wide' : ''}`} hidden={!shown(pj)} data-reveal="" data-delay={(i % 2) * 80}>
                <div className="wcard-art"><MiniScene slug={pj.slug} /></div>
                <div className="wcard-body">
                  <div className="wcard-top">
                    <Place place={pj.place} />
                    <span className="wcard-cat">{pj.category}</span>
                  </div>
                  <h3><a href={caseStudyPath(pj)} className="card-link">{clientName(pj)}</a></h3>
                  <p className="wcard-line">{sceneTitle(pj.slug) || pj.alias}</p>
                  {pj.points && <ul className="points">{pj.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
                  <div className="wcard-foot">
                    {pj.metrics
                      ? <span className="wcard-metric"><strong data-count="">{pj.metrics[0].value}</strong>{pj.metrics[0].label}</span>
                      : <span className="wcard-metric wcard-metric--plain">{pj.platform}</span>}
                    <span className="go" aria-hidden="true">Case study <em>→</em></span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
