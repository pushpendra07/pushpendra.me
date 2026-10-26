import { useEffect, useMemo, useRef } from 'react';
import {
  ArchitectureDiagram, BranchDiagram, PipelineDiagram, ZoneDiagram,
} from '../components/CaseDiagrams';
import { caseStudies } from '../data/caseStudies';
import useActiveSection from '../hooks/useActiveSection';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { projects } from '../data/profile';
import { externalProps, getLinks } from '../lib/links';
import { caseStudyPath, clientName } from '../lib/projects';


const ICONS = {
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><circle cx="7" cy="7" r="1" /></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  bag: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18M16 10a4 4 0 0 1-8 0" /></>,
  retry: <><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" /><path d="M21 3v5h-5" /></>,
  sync: <><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" /><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5M3 21v-5h5" /></>,
  truck: <><path d="M1 4h14v12H1z" /><path d="M15 8h4l3 3v5h-7z" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  layers: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5M2 12l10 5 10-5" /></>,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>,
  code: <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />,
  box: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>,
};

function Icon({ name }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function SectionHead({ n, title, intro, dark = false }) {
  return (
    <div className="heading cs-head" data-reveal="">
      <span className={`eyebrow${dark ? ' eyebrow--dark' : ''}`}>{n}</span>
      <h2 className="h2">{title}</h2>
      {intro && <p className="cs-intro">{intro}</p>}
    </div>
  );
}

const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'];

function Diagram({ d, id }) {
  return d.type === 'branch' ? <BranchDiagram d={d} id={id} /> : <PipelineDiagram d={d} id={id} />;
}

// Sticky chip menu of the page's sections; highlights the one in view.
function SectionMenu({ items }) {
  const ids = useMemo(() => items.map(([key]) => `cs-${key}`), [items]);
  const active = useActiveSection(ids);
  const listRef = useRef(null);

  // Keep the active chip visible when the menu scrolls sideways on small screens.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector('.is-active');
    if (link) list.scrollTo({ left: link.offsetLeft - 16, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [active]);

  return (
    <nav className="cs-toc" aria-label="Case study sections">
      <ol ref={listRef} className="cs-container cs-toc-list">
        {items.map(([key, label]) => {
          const on = active === `cs-${key}`;
          return (
            <li key={key}>
              <a href={`#cs-${key}`} className={`cs-toc-link${on ? ' is-active' : ''}`} aria-current={on ? 'true' : undefined}>
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Renders whichever sections a study has.
function DeepSections({ study, details }) {
  const arch = study.architecture;
  const diagrams = study.diagrams ?? [];
  const menu = useMemo(() => [
    study.highlights && ['highlights', 'Highlights'],
    study.architecture && ['architecture', 'Architecture'],
    study.gallery?.length && ['gallery', 'Screens'],
    study.capabilities && ['capabilities', 'Capabilities'],
    study.flow && ['flow', 'Flow'],
    study.zones && ['zones', 'Delivery zones'],
    (study.challenges || study.diagrams) && ['challenges', 'Challenges'],
    study.decisions && ['decisions', 'Decisions'],
    study.stack && ['stack', 'Stack'],
    ['log', 'Build log'],
  ].filter(Boolean), [study]);

  return (
    <>
      <SectionMenu items={menu} />
      {study.highlights && (
        <section id="cs-highlights" className="cs-section cs-section--light">
          <div className="cs-container cs-stack-sm">
            <SectionHead n="HIGHLIGHTS"
              title={study.highlightsTitle ?? `${COUNT_WORDS[study.highlights.length]} things that set this build apart.`} />
            <ul className="cs-highlights">
              {study.highlights.map((h, i) => (
                <li key={h.title} className={`cs-hl cs-hl--${i}`} data-reveal="" data-delay={i * 80}>
                  <span className="cs-hl-icon"><Icon name={h.icon} /></span>
                  <h3 className="cs-hl-title">{h.title}</h3>
                  <p className="cs-hl-text">{h.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {arch && (
        <section id="cs-architecture" className="cs-section cs-section--dark">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='ARCHITECTURE OVERVIEW' title={arch.title} intro={arch.intro} dark />
            <div className="cs-diagram-frame" data-reveal="">
              <div className="cs-diagram-scroll"><ArchitectureDiagram data={arch} id="arch" /></div>
            </div>
            {arch.callout && (
              <div className="cs-callout" data-reveal="">
                <strong>What makes it different</strong>
                <p>{arch.callout}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {study.gallery?.length > 0 && (
        <section id="cs-gallery" className="cs-section cs-section--tint">
          <div className="cs-container cs-stack-sm">
            <SectionHead n="IN PRODUCTION" title="What customers see." />
            <div className="cs-gallery">
              {study.gallery.map((g, i) => (
                <figure key={g.src} className="cs-shot" data-reveal="" data-delay={(i % 2) * 100}>
                  <img src={g.src} alt={g.alt} loading="lazy" decoding="async" width={g.width} height={g.height} />
                  {g.caption && <figcaption>{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {study.capabilities && (
        <section id="cs-capabilities" className="cs-section cs-section--light">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='WHAT THE PLATFORM DOES' title={study.capabilitiesTitle ?? 'What the platform does.'} />
            <ul className="cs-caps">
              {study.capabilities.map(([title, text], i) => (
                <li key={title} className={`cs-cap cs-cap--${i % 10}`} data-reveal="" data-delay={(i % 2) * 80}>
                  <h3 className="cs-cap-title">{title}</h3>
                  <p className="cs-cap-text">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {study.flow && (
        <section id="cs-flow" className="cs-section cs-section--tint">
          <div className="cs-container cs-stack-sm">
            <SectionHead n={study.flow.label} title={study.flow.title} intro={study.flow.intro} />
            <ol className="cs-flow" data-reveal="" style={{ '--n': study.flow.steps.length }}>
              {study.flow.steps.map(([title, text], i) => (
                <li key={title} className="cs-step" style={{ '--i': i }}>
                  <span className="cs-step-n">STEP {i + 1}</span>
                  <h3 className="cs-step-title">{title}</h3>
                  <p className="cs-step-text">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {study.zones && (
        <section id="cs-zones" className="cs-section cs-section--light">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='HOW DELIVERY ZONES WORK' title="Polygon › Zone › Source." intro={study.zones.intro} />
            <div className="cs-zones">
              <div className="cs-zone-art" data-reveal=""><ZoneDiagram /></div>
              <ul className="cs-zone-list">
                {study.zones.levels.map(([title, text], i) => (
                  <li key={title} className={`cs-zone-item cs-zone-item--${i}`} data-reveal="" data-delay={i * 90}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {(study.challenges || diagrams.length > 0) && (
        <section id="cs-challenges" className="cs-section cs-section--dark">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='KEY TECHNICAL CHALLENGES'
              title={study.challenges?.title ?? 'How it works.'} intro={study.challenges?.intro} dark />
            {study.challenges && (
              <ol className="cs-challenges">
                {study.challenges.items.map(([title, problem, solution, result], i) => (
                  <li key={title} className={`cs-ch${result ? '' : ' cs-ch--two'}`} data-reveal="">
                    <div className="cs-ch-problem">
                      <h3>{title}</h3>
                      <p>{problem}</p>
                    </div>
                    <div className="cs-ch-cell">
                      <span className="cs-ch-label">Solution</span>
                      <p>{solution}</p>
                    </div>
                    {result && (
                      <div className="cs-ch-cell cs-ch-cell--result">
                        <span className="cs-ch-label">Result</span>
                        <p>{result}</p>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
            {diagrams.length > 0 && (
              <div className="cs-mini-grid">
                {diagrams.map((d, i) => (
                  <figure key={d.title} className="cs-mini" data-reveal="" data-delay={(i % 2) * 110}>
                    <figcaption><strong>{d.title}</strong><span>{d.caption}</span></figcaption>
                    <Diagram d={d} id={`dg${i}`} />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {study.decisions && (
        <section id="cs-decisions" className="cs-section cs-section--light">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='DESIGN DECISIONS' title="The options weighed, and the trade-offs accepted."
              intro="How the hardest calls were made: what else was on the table, why it lost, and what the chosen design costs." />
            <div className="cs-decisions">
              {study.decisions.map((dec) => (
                <article key={dec.title} className="cs-dec" data-reveal="">
                  <h3 className="cs-dec-title">{dec.title}</h3>
                  <p className="cs-dec-problem">{dec.problem}</p>
                  <ol className="cs-dec-options">
                    {dec.options.map((opt, k) => (
                      <li key={opt} className={k === dec.chosen ? 'is-chosen' : ''}>
                        <span className="cs-dec-mark" aria-hidden="true">{k === dec.chosen ? '✓' : '✕'}</span>
                        <span>{opt}{k === dec.chosen && <span className="sr-only"> (chosen)</span>}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="cs-dec-row">
                    <span className="cs-dec-label">Decision</span>
                    <p>{dec.decision}</p>
                  </div>
                  <div className="cs-dec-row cs-dec-row--risk">
                    <span className="cs-dec-label">Trade-off accepted</span>
                    <p>{dec.tradeoff}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {study.stack && (
        <section id="cs-stack" className="cs-section cs-section--light cs-section--rule">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='TECHNOLOGIES & INTEGRATIONS' title="The stack behind it." />
            <dl className="cs-stack-table" data-reveal="">
              {study.stack.map(([group, items]) => (
                <div key={group} className="cs-stack-row">
                  <dt>{group}</dt>
                  <dd>{items.map((it) => <span key={it} className="tag-light">{it}</span>)}</dd>
                </div>
              ))}
              {study.skills && (
                <div className="cs-stack-row">
                  <dt>Skills shown</dt>
                  <dd>{study.skills.map((it) => <span key={it} className="cs-skill">{it}</span>)}</dd>
                </div>
              )}
            </dl>
          </div>
        </section>
      )}

      <section id="cs-log" className="cs-section cs-section--tint">
        <div className="cs-container cs-stack-sm">
          <SectionHead n='FULL BUILD LOG' title="The work, piece by piece." />
          <BuildList details={details} />
        </div>
      </section>
    </>
  );
}

function BuildList({ details }) {
  return (
    <ol className="cs-list">
      {details.map((d, k) => (
        <li key={d} className="cs-item" data-reveal="" data-delay={(k % 2) * 90}>
          <span className="cs-item-n" aria-hidden="true">✓</span>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  );
}

export default function CaseStudy({ project: pj }) {
  const { emailHref, emailLabel, linkedin } = getLinks();
  const study = caseStudies[pj.slug];
  const i = projects.indexOf(pj);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const facts = study?.facts ?? [
    ...(pj.place ? [['Location', pj.place]] : []),
    ['Platform', pj.platform],
    ['Sector', pj.category],
  ];

  // Pre-rendered pages already carry this title; this covers the dev server.
  useEffect(() => { document.title = `${clientName(pj)} case study — Pushpendra Singh`; }, [pj]);

  return (
    <main className="cs">
      <header className="cs-hero">
        <div className="cs-hero-glow" aria-hidden="true" />
        <div className="cs-container cs-hero-inner">
          <a href="/#projects" className="cs-back">← All projects</a>
          <span className="eyebrow eyebrow--dark">
            {study ? 'ARCHITECTURE CASE STUDY' : 'CASE STUDY'}
          </span>
          <h1 className="cs-title">{clientName(pj)}</h1>
          <p className="cs-lead">{study?.lead ?? pj.desc}</p>
          <dl className="cs-meta">
            {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="tags">
            {(study?.tags ?? pj.tags).map((tg) => <span key={tg} className="tag-dark">{tg}</span>)}
          </div>
        </div>
      </header>

      {pj.metrics && (
        <section className="cs-metrics-band" aria-label="Key numbers">
          <div className="cs-container">
            <dl className="cs-metrics">
              {pj.metrics.map((m) => (
                <div key={m.label} className="cs-metric">
                  <dt className="cs-metric-label">{m.label}</dt>
                  <dd className="cs-metric-value">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {study ? <DeepSections study={study} details={pj.details} /> : (
        <section className="cs-body">
          <div className="cs-container cs-stack">
            <div className="cs-brief">
              <article className="cs-card" data-reveal="">
                <span className="cs-card-label">The challenge</span>
                <p>{pj.problem}</p>
              </article>
              <article className="cs-card cs-card--accent" data-reveal="" data-delay={110}>
                <span className="cs-card-label">The approach</span>
                <p>{pj.solution}</p>
              </article>
            </div>
            <div className="cs-built">
              <SectionHead n="WHAT I BUILT" title="The work, piece by piece." />
              <BuildList details={pj.details} />
            </div>
          </div>
        </section>
      )}

      <section className="cs-pager-band">
        <nav className="cs-container cs-pager" aria-label="More case studies">
          <a href={caseStudyPath(prev)} className="cs-pager-link">
            <span className="cs-pager-dir">← Previous</span>
            <span className="cs-pager-title">{clientName(prev)}</span>
            <span className="cs-pager-cat">{prev.category}</span>
          </a>
          <a href={caseStudyPath(next)} className="cs-pager-link cs-pager-link--next">
            <span className="cs-pager-dir">Next →</span>
            <span className="cs-pager-title">{clientName(next)}</span>
            <span className="cs-pager-cat">{next.category}</span>
          </a>
        </nav>
      </section>

      <section className="cs-cta">
        <div className="contact-glow" aria-hidden="true" />
        <div className="cs-container cs-cta-inner">
          <h2 className="cs-cta-title">Facing a similar <span className="gradient-text">commerce problem?</span></h2>
          <p className="contact-lead">I&apos;m available immediately for senior Adobe Commerce roles and contract work. Tell me what you&apos;re building.</p>
          <div className="contact-actions">
            <a href={emailHref} className="btn-white">{emailLabel}</a>
            <a href={linkedin.href} className="btn-outline" {...externalProps(linkedin.external)}>LinkedIn</a>
            <a href="/#projects" className="btn-outline">All projects</a>
          </div>
        </div>
      </section>
    </main>
  );
}
