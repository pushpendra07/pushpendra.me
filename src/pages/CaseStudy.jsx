import { useEffect, useMemo, useRef } from 'react';
import {
  ArchitectureDiagram, BranchDiagram, PipelineDiagram, ZoneDiagram,
} from '../components/CaseDiagrams';
import { caseStudies } from '../data/caseStudies';
import { lookFor, mapCopy } from '../data/caseLooks';
import useActiveSection from '../hooks/useActiveSection';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { externalProps, getLinks } from '../lib/links';
import { openEmail } from '../lib/email';
import BrandIcon from '../components/BrandIcon';
import Place from '../components/Place';
import Points from '../components/Points';
import IntegrationMap from '../components/IntegrationMap';
import ProjectScene, { hasScene } from '../components/ProjectScene';
import { brands } from '../data/brands';
import { caseStudyPath, clientName, siblingsOf } from '../lib/projects';


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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

// Brand mark for a technology name when one exists (SAP, GraphQL, RabbitMQ, Redis, MySQL and so on).
const BRAND_MATCH = Object.entries(brands).map(([key, b]) => [key, b.title.toLowerCase()]);
function brandFor(name) {
  const n = name.toLowerCase();
  const hit = BRAND_MATCH.find(([key, title]) => n.includes(title) || n.startsWith(key));
  return hit ? hit[0] : null;
}
function Tech({ name }) {
  const b = brandFor(name);
  return <span className="tech-chip">{b && <BrandIcon name={b} size={14} />}{name}</span>;
}

// Section labels are numbered by a CSS counter, so the numbers follow whichever sections a study has.
function SectionHead({ n, title, intro }) {
  return (
    <div className="heading cs-head" data-reveal="">
      <span className="tag cs-tag">{n}</span>
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

  const barRef = useRef(null);
  // Reading progress: a thin bar under the menu, updated at most once a frame.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <nav className="cs-toc" id="case-study" aria-label="Case study sections">
      <span ref={barRef} className="cs-progress" aria-hidden="true" />
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
// Up to ten systems for the integration map: everything in the stack table except the platform
// itself, branded tools first so the picture is easy to read.
function mapNodes(study, platform) {
  const seen = new Set();
  const all = (study.stack || []).flatMap(([group, items], g) => items.map((name, k) => ({ name, group, first: g === 0 && k === 0 })));
  const nodes = all.filter((x) => !x.first && !seen.has(x.name.toLowerCase()) && seen.add(x.name.toLowerCase()) && x.name !== platform);
  return [...nodes.filter((x) => brandFor(x.name)), ...nodes.filter((x) => !brandFor(x.name))].slice(0, 10);
}

function DeepSections({ study, details, pj }) {
  const nodes = mapNodes(study, pj.platform);
  const product = pj.kind === 'product';
  const arch = study.architecture;
  const diagrams = study.diagrams ?? [];
  const look = lookFor(pj.slug);
  const copy = mapCopy(look.map, { name: product ? pj.title : clientName(pj), platform: pj.platform, product, nodes });
  const menu = useMemo(() => [
    nodes.length >= 3 && ['map', 'Integrations'],
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
  ].filter(Boolean), [study, nodes.length]);

  return (
    <>
      <SectionMenu items={menu} />
      {nodes.length >= 3 && (
        <section id="cs-map" className="cs-section cs-section--tint">
          <div className="cs-container cs-stack-sm">
            <SectionHead n={product ? 'How it fits together' : 'Integration map'} title={copy.title} intro={copy.intro} />
            <div data-reveal="">
              <IntegrationMap center={product ? pj.title : pj.platform} sub={product ? pj.category : clientName(pj)} nodes={nodes} brandFor={brandFor} variant={look.map} />
            </div>
          </div>
        </section>
      )}

      {study.highlights && (
        <section id="cs-highlights" className="cs-section cs-section--light">
          <div className="cs-container cs-stack-sm">
            <SectionHead n="Highlights"
              title={study.highlightsTitle ?? `${COUNT_WORDS[study.highlights.length]} things that set this build apart`} />
            <ul className="cs-highlights">
              {study.highlights.map((h, i) => (
                <li key={h.title} className={`cs-hl cs-hl--${i % 5}`} data-reveal="" data-delay={i * 80}>
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
        <section id="cs-architecture" className="cs-section cs-section--feature">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='Architecture overview' title={arch.title} intro={arch.intro} />
            <div className={`cs-diagram-frame cs-arch--${look.arch}`} data-reveal="">
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
            <SectionHead n={study.galleryLabel ?? 'In production'} title={study.galleryTitle ?? 'What customers see'} />
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
            <SectionHead n='What the platform does' title={study.capabilitiesTitle ?? 'What the platform does'} />
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
            <ol className={`cs-flow cs-flow--${look.flow}`} data-reveal="" style={{ '--n': study.flow.steps.length }}>
              {study.flow.steps.map(([title, text], i) => (
                <li key={title} className="cs-step" style={{ '--i': i }} data-n={String(i + 1).padStart(2, '0')}>
                  <span className="cs-step-n">Step {i + 1}</span>
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
            <SectionHead n='How delivery zones work' title="Polygon, zone, source" intro={study.zones.intro} />
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
        <section id="cs-challenges" className="cs-section cs-section--feature">
          <div className="cs-container cs-stack-sm">
            <SectionHead n='Key technical challenges'
              title={study.challenges?.title ?? 'How it works'} intro={study.challenges?.intro} />
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
            <SectionHead n='Design decisions' title="The options weighed, and the trade-offs accepted"
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
            <SectionHead n='Technologies and integrations' title="The stack behind it" />
            <dl className="cs-stack-table" data-reveal="">
              {study.stack.map(([group, items]) => (
                <div key={group} className="cs-stack-row">
                  <dt>{group}</dt>
                  <dd>{items.map((it) => <Tech key={it} name={it} />)}</dd>
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
          <SectionHead n='Full build log' title="The work, piece by piece" />
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
          <span className="cs-item-n" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
          <p>{d}</p>
        </li>
      ))}
    </ol>
  );
}

export default function CaseStudy({ project: pj }) {
  const { linkedin } = getLinks();
  const study = caseStudies[pj.slug];
  const product = pj.kind === 'product';
  const list = siblingsOf(pj);
  const back = product ? '/#ai-builds' : '/#projects';
  const i = list.indexOf(pj);
  const prev = list[(i - 1 + list.length) % list.length];
  const next = list[(i + 1) % list.length];
  // Up to three related studies: those sharing a focus area first, then the rest in order.
  const shared = (r) => (pj.focus || []).filter((f) => (r.focus || []).includes(f)).length;
  const related = list.filter((r) => r !== pj).map((r, k) => ({ r, k, s: shared(r) }))
    .sort((x, y) => y.s - x.s || x.k - y.k).slice(0, 3).map(({ r }) => r);
  const facts = study?.facts ?? [
    ...(pj.place ? [['Location', pj.place]] : []),
    ['Platform', pj.platform],
    ['Sector', pj.category],
  ];

  // Pre-rendered pages already carry this title; this covers the dev server.
  useEffect(() => {
    document.title = product ? `${pj.title}: product case study — Pushpendra Singh` : `${clientName(pj)} case study — Pushpendra Singh`;
  }, [pj, product]);

  return (
    <main id="main" className="cs" style={{ '--pj-h': lookFor(pj.slug).hue, '--pj-l': `${lookFor(pj.slug).light}%` }}>
      <header className="cs-hero">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="cs-container cs-hero-grid">
          <div className="cs-hero-main">
            <a href={back} className="cs-back">← {product ? 'All AI builds' : 'All projects'}</a>
            <span className="tag">
              {product ? 'Product case study · built with AI' : study ? 'Architecture case study' : 'Case study'}
            </span>
            <h1 className="cs-title">{clientName(pj)}</h1>
            <p className="cs-lead">{study?.lead ?? pj.desc}</p>
            <div className="ctas">
              <a href="#contact" data-lead="email" onClick={openEmail(`About ${clientName(pj)}`)} className="pill pill-primary">
                {product ? 'Ask for a walkthrough' : 'Discuss a similar project'} <span className="arr" aria-hidden="true">→</span>
              </a>
              <a href="#case-study" className="pill pill-ghost">Read the case study ↓</a>
            </div>
            {product && (
              <div className="cs-links">
                {pj.demoUrl && <a href={pj.demoUrl} className="btn-white" {...externalProps(true)}>Live demo ↗</a>}
                {pj.repoUrl
                  ? <a href={pj.repoUrl} className="btn-outline" {...externalProps(true)}>View on GitHub ↗</a>
                  : <span className="cs-private">Source code is private · walkthrough on request</span>}
              </div>
            )}
          </div>

          <aside className="cs-panel" aria-label="At a glance">
            <div className="cs-panel-head">
              <span className="kicker">At a glance</span>
              <Place place={pj.place} fallback={product ? 'My own product' : 'Remote client'} />
            </div>
            {pj.metrics && (
              <dl className="cs-panel-metrics">
                {pj.metrics.map((m) => (
                  <div key={m.label}><dt>{m.label}</dt><dd data-count="">{m.value}</dd></div>
                ))}
              </dl>
            )}
            <dl className="cs-panel-facts">
              {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="cs-panel-tech">
              {(study?.tags ?? pj.tags).map((tg) => <Tech key={tg} name={tg} />)}
            </div>
          </aside>
        </div>
      </header>

      {hasScene(pj.slug) && (
        <section className="cs-scene-band" aria-label="Project in one picture">
          <div className="cs-container" data-reveal=""><ProjectScene slug={pj.slug} /></div>
        </section>
      )}

      {study ? <DeepSections study={study} details={pj.details} pj={pj} /> : (
        <section className="cs-body" id="case-study">
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
              <SectionHead n="What I built" title="The work, piece by piece" />
              <BuildList details={pj.details} />
            </div>
          </div>
        </section>
      )}

      <section className="cs-more" aria-labelledby="more-title">
        <div className="cs-container">
          <span className="tag">{product ? 'More AI builds' : 'More case studies'}</span>
          <h2 className="h2" id="more-title">{product ? 'Other products I built' : "Related platforms I've built"}</h2>
          <div className="project-grid">
            {related.map((r, k) => (
              <article key={r.slug} className="pcard" data-reveal="" data-delay={k * 70}>
                <div className="pcard-top"><Place place={r.place} fallback={product ? 'My own product' : 'Remote client'} /><span className="num">{r.n}</span></div>
                <span className="pcard-cat">{r.category}</span>
                <h3><a href={caseStudyPath(r)} className="card-link">{clientName(r)}</a></h3>
                {r.points ? <Points items={r.points} /> : <p>{r.desc}</p>}
                {r.metrics
                  ? <div className="metric"><strong data-count="">{r.metrics[0].value}</strong><span>{r.metrics[0].label}</span></div>
                  : <div className="metric metric-plain"><span>{r.platform}</span></div>}
                <span className="go" aria-hidden="true">Case study <em>→</em></span>
              </article>
            ))}
          </div>

          <nav className="cs-pager" aria-label={product ? 'Previous and next AI build' : 'Previous and next case study'}>
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
        </div>
      </section>

      <section className="section contact" id="contact">
        <div className="cs-container">
          <div className="cta-card" data-reveal="">
            <span className="tag tag-dark">Available immediately</span>
            <h2 className="h2">{product ? <>Want a walkthrough? <span className="soft">Let&apos;s talk.</span></> : <>Facing a similar problem? <span className="soft">Let&apos;s talk.</span></>}</h2>
            <p>
              {product
                ? 'The code is private, but I am happy to demo the product and talk through the architecture.'
                : 'I am available immediately for senior Adobe Commerce roles and contract work. Tell me what you are building.'}
            </p>
            <div className="ctas">
              <a href="#contact" data-lead="email" onClick={openEmail(`About ${clientName(pj)}`)} className="pill pill-light pill-solo">Email me <span className="arr" aria-hidden="true">→</span></a>
              <a href={linkedin.href} className="pill pill-glass" {...externalProps(linkedin.external)}>LinkedIn</a>
              <a href={back} className="pill pill-glass">{product ? 'All AI builds' : 'All projects'}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
