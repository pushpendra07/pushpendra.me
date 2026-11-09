import { useEffect, useRef, useState } from 'react';
import BrandIcon from '../components/BrandIcon';
import { skills, skillStory } from '../data/profile';
import { track } from '../lib/analytics';
import { scrollToHash } from '../lib/scroll';

// Skills as a scroll story. On wide screens the stage sticks while the page scrolls past it:
// the left side swaps the numbered step, the right side swaps the animated scene. On phones
// every step is stacked and shown in full, so nothing depends on scroll position.

const learning = skills.find((s) => s.learning);
const pad = (n) => String(n).padStart(2, '0');
// One colour per step (light / dark theme), used for its number, label, dash and art panel.
const TONES = [['#2563eb', '#7aa7ff'], ['#0f766e', '#5eead4'], ['#7c3aed', '#b9a2ff'], ['#c2410c', '#fdba74'], ['#be185d', '#f9a8d4'], ['#15803d', '#86efac'], ['#4f46e5', '#a5b4fc']];
const tone = (i) => ({ '--c': TONES[i % TONES.length][0], '--c-dark': TONES[i % TONES.length][1] });

function Scene({ id, chips }) {
  switch (id) {
    case 'platform':
      return (
        <div className="sk-scene sk-platform">
          <span className="sk-ring sk-ring-a" /><span className="sk-ring sk-ring-b" />
          <div className="sk-core">
            <BrandIcon name="adobe" size={30} /><BrandIcon name="magento" size={30} />
          </div>
          {chips.map((c, i) => <span key={c} className={`sk-chip sk-orbit sk-o${i}`} style={{ '--i': i }}>{c}</span>)}
        </div>
      );
    case 'code': {
      const tree = [
        ['app/code/Vendor/Module/', 0, 'dir'],
        ['registration.php', 1, 'php'], ['etc/module.xml', 1, 'xml'], ['etc/di.xml', 1, 'xml'],
        ['etc/events.xml', 1, 'xml'], ['Api/', 1, 'dir'], ['Model/', 1, 'dir'], ['Plugin/', 1, 'dir'],
        ['Observer/', 1, 'dir'], ['Setup/Patch/Data/', 1, 'dir'],
      ];
      return (
        <div className="sk-scene sk-code">
          <div className="sk-card sk-tree">
            <div className="sk-card-head"><BrandIcon name="php" size={22} /><span>Vendor_Module</span></div>
            <ul>
              {tree.map(([f, d, t], i) => (
                <li key={f} className={`sk-f sk-f-${t}`} style={{ '--i': i, paddingLeft: 12 + d * 18 }}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="sk-side">{chips.map((c, i) => <span key={c} className="sk-chip sk-pop" style={{ '--i': i + 3 }}>{c}</span>)}</div>
        </div>
      );
    }
    case 'systems': {
      const nodes = [['SAP', 'sap'], ['Dynamics AX'], ['Payment gateways'], ['Loyalty & promotions']];
      return (
        <div className="sk-scene sk-systems">
          <svg className="sk-wires" viewBox="0 0 400 400" aria-hidden="true">
            {[[80, 80], [320, 80], [80, 320], [320, 320]].map(([x, y], i) => (
              <g key={i}>
                <line x1="200" y1="200" x2={x} y2={y} />
                <circle r="4" className="sk-pulse" style={{ '--i': i, offsetPath: `path('M200 200 L${x} ${y}')` }} />
              </g>
            ))}
          </svg>
          <div className="sk-hub"><BrandIcon name="magento" size={34} /><span>Adobe Commerce</span></div>
          {nodes.map(([n, icon], i) => (
            <div key={n} className={`sk-node sk-n${i}`} style={{ '--i': i }}>
              {icon && <BrandIcon name={icon} size={20} />}<span>{n}</span>
            </div>
          ))}
          <div className="sk-protocols">
            {['REST', 'SOAP', 'RabbitMQ'].map((p, i) => (
              <span key={p} className="sk-chip sk-pop" style={{ '--i': i + 4 }}>{p === 'RabbitMQ' && <BrandIcon name="rabbitmq" size={14} />}{p}</span>
            ))}
          </div>
        </div>
      );
    }
    case 'front':
      return (
        <div className="sk-scene sk-front">
          <div className="sk-card sk-query">
            <div className="sk-card-head"><BrandIcon name="graphql" size={20} /><span>query.graphql</span></div>
            <pre>{`query {
  products(search: "drill") {
    items {
      sku
      name
      price_range { … }
    }
  }
}`}</pre>
          </div>
          <div className="sk-phone">
            <span className="sk-notch" />
            {[0, 1, 2, 3].map((i) => <span key={i} className="sk-tile" style={{ '--i': i }}><i /><b /><b /></span>)}
          </div>
          <div className="sk-front-chips">
            <span className="sk-chip sk-pop" style={{ '--i': 5 }}><BrandIcon name="react" size={14} />React.js</span>
            {chips.filter((c) => !/GraphQL|React/.test(c)).map((c, i) => <span key={c} className="sk-chip sk-pop" style={{ '--i': i + 6 }}>{c}</span>)}
          </div>
        </div>
      );
    case 'speed': {
      const layers = [['Fastly CDN', 'fastly', 92], ['Varnish', null, 74], ['Redis', 'redis', 48], ['MySQL', 'mysql', 22]];
      return (
        <div className="sk-scene sk-speed">
          <div className="sk-layers">
            {layers.map(([n, icon, hit], i) => (
              <div key={n} className="sk-layer" style={{ '--i': i, '--hit': `${hit}%` }}>
                <span className="sk-layer-name">{icon && <BrandIcon name={icon} size={18} />}{n}</span>
                <span className="sk-bar"><i /></span>
              </div>
            ))}
            <span className="sk-drop" aria-hidden="true" />
          </div>
          <div className="sk-side sk-side-row">
            <span className="sk-chip sk-pop" style={{ '--i': 5 }}><BrandIcon name="newrelic" size={14} />New Relic</span>
            <span className="sk-chip sk-pop" style={{ '--i': 6 }}>Slow-query analysis</span>
            <span className="sk-chip sk-pop" style={{ '--i': 7 }}>N+1 fixes</span>
          </div>
        </div>
      );
    }
    case 'secure':
      return (
        <div className="sk-scene sk-secure">
          <div className="sk-shield">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z" /><path className="sk-tick" d="m8.5 12 2.5 2.5 4.5-5" /></svg>
          </div>
          <ul className="sk-checks">
            {chips.map((c, i) => <li key={c} style={{ '--i': i }}><span className="sk-dot" />{c}</li>)}
          </ul>
        </div>
      );
    case 'team': {
      const flow = ['Estimate', 'Build', 'Review', 'UAT', 'Release', 'Support'];
      return (
        <div className="sk-scene sk-team">
          <ol className="sk-flow">
            {flow.map((f, i) => <li key={f} style={{ '--i': i }}><span>{pad(i + 1)}</span>{f}</li>)}
          </ol>
          <div className="sk-side sk-side-row">
            {['Git', 'Bitbucket', 'JIRA', 'Composer', 'Mentoring', 'PSR standards'].map((c, i) => (
              <span key={c} className="sk-chip sk-pop" style={{ '--i': i + 6 }}>{c}</span>
            ))}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function Skills() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [stacked, setStacked] = useState(false);
  const n = skillStory.length;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el || mq.matches) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 0.9999) : 0;
      setActive(Math.floor(p * n));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const onMq = () => { setStacked(mq.matches); measure(); };
    onMq();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    mq.addEventListener('change', onMq);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener('change', onMq);
    };
  }, [n]);

  // GA4: how far into the story people get (each step once per page view).
  const seenSteps = useRef(new Set());
  useEffect(() => {
    // Step 1 is the resting state before the story is reached; section_view covers it.
    if (stacked || active === 0 || seenSteps.current.has(active)) return;
    seenSteps.current.add(active);
    track('skill_step_view', { step: active + 1, step_name: skillStory[active].key });
  }, [active, stacked]);

  const goTo = (i) => {
    track('skill_step_click', { step: i + 1, step_name: skillStory[i].key });
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (span * (i + 0.5)) / n, behavior: 'smooth' });
  };

  return (
    <section id="skills" className="sk" aria-labelledby="skills-title">
      <div className="wrap sk-intro">
        <span className="tag">Skills</span>
        <h2 id="skills-title" className="h2" data-reveal="">How a store comes together, <span className="accent">one layer at a time</span></h2>
      </div>

      <div className="sk-track" ref={trackRef} style={{ '--n': n }}>
        <div className="sk-stage wrap">
          {skillStory.map((s, i) => (
            <article key={s.key} className="sk-step" style={tone(i)} data-on={stacked || i === active ? '' : undefined} aria-hidden={!stacked && i !== active ? true : undefined}>
              <div className="sk-narr">
                <span className="sk-kicker"><span className="sk-num">{pad(i + 1)}</span><span className="sk-label">{s.label}</span></span>
                <h3 className="sk-title">{s.title} <span className="accent">{s.accent}</span></h3>
                <p className="sk-text">{s.text}</p>
              </div>
              <div className="sk-art"><Scene id={s.key} chips={s.chips} /></div>
            </article>
          ))}
          <div className="sk-dashes" role="tablist" aria-label="Skill steps">
            {skillStory.map((s, i) => (
              <button
                key={s.key} type="button" role="tab" aria-selected={i === active}
                aria-label={`${pad(i + 1)} ${s.label}`} className={i <= active ? 'on' : ''} style={tone(i)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {learning && (
        <div className="wrap sk-learning">
          {/* A card with a slowly turning gradient edge; the headline rolls through the topics. */}
          <div className="learn" data-reveal="">
            <span className="learn-kicker"><i className="learn-dot" />Currently learning</span>
            <p className="learn-line">
              <span className="learn-now">Now exploring</span>
              <span className="learn-roll" aria-hidden="true" style={{ '--n': learning.items.length }}>
                {learning.items.map((it, i) => <span key={it} style={{ '--i': i }}>{it}</span>)}
              </span>
            </p>
            <ul className="learn-chips">
              {learning.items.map((it, i) => (
                <li key={it} style={{ '--i': i }}><i className="learn-spin" aria-hidden="true" />{it}</li>
              ))}
            </ul>
            <div className="learn-proof">
              <span className="learn-badge"><svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" /></svg>Quick learner</span>
              <p className="learn-note">{learning.note}</p>
              <a href="#ai-builds" onClick={scrollToHash} className="learn-go">See what I built <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
