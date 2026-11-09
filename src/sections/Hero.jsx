import { Fragment, useEffect, useRef } from 'react';
import AskBox from '../components/AskBox';
import BrandIcon from '../components/BrandIcon';
import HeroCanvas from '../components/HeroCanvas';
import Portrait from '../components/Portrait';
import RollingLine from '../components/RollingLine';
import { heroChecks } from '../data/profile';
import { scrollToHash } from '../lib/scroll';
import { prefersReducedMotion } from '../hooks/useReducedMotion';

const WORDS = ['I', 'build', 'Adobe', 'Commerce', 'stores'];

// The hero is a stage: a rounded panel with a live colour field (HeroCanvas), a big white
// headline whose last line rolls, and small "live commerce" cards floating around it that lean
// with the pointer. Below it, the introduction with the portrait.
export default function Hero() {
  const stageRef = useRef(null);

  // Pointer parallax for the floating cards: --mx / --my run from -1 to 1.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return undefined;
    let raf = 0, x = 0, y = 0;
    const onMove = (e) => {
      const b = stage.getBoundingClientRect();
      x = ((e.clientX - b.left) / b.width) * 2 - 1;
      y = ((e.clientY - b.top) / b.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        stage.style.setProperty('--mx', x.toFixed(3));
        stage.style.setProperty('--my', y.toFixed(3));
      });
    };
    const onLeave = () => { x = 0; y = 0; onMove({ clientX: stage.getBoundingClientRect().left + stage.offsetWidth / 2, clientY: stage.getBoundingClientRect().top + stage.offsetHeight / 2 }); };
    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <section id="home" className="hero">
      <div className="stage" ref={stageRef}>
        <HeroCanvas stageRef={stageRef} />
        <div className="stage-shade" aria-hidden="true" />

        <div className="stage-cards" aria-hidden="true">
          <div className="hc hc-order" style={{ '--d': 18 }}>
            <div className="hc-in">
              <span className="hc-k"><i className="hc-dot" />Order flow · live</span>
              <ol className="hc-steps">
                <li className="done">Placed</li>
                <li className="done">Paid</li>
                <li className="now">Picked</li>
                <li>Shipped</li>
              </ol>
              <span className="hc-row"><BrandIcon name="sap" size={14} /> SAP ERP <em className="hc-ok">Synced</em></span>
            </div>
          </div>
          <div className="hc hc-chip hc-deploy" style={{ '--d': 34 }}>
            <div className="hc-in">
              <code><span>$</span> bin/magento setup:di:compile</code>
              <span className="hc-row"><em className="hc-ok">✓ Passed</em> Generated code ready</span>
            </div>
          </div>
          <div className="hc hc-chip hc-queue" style={{ '--d': 30 }}>
            <div className="hc-in">
              <span className="hc-row"><BrandIcon name="rabbitmq" size={14} /> RabbitMQ · order.export</span>
              <span className="hc-q" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </div>
          </div>
          <div className="hc hc-promo" style={{ '--d': 26 }}>
            <div className="hc-in">
              <span className="hc-k">Cart rule · Talon.One</span>
              <span className="hc-promo-row"><b className="hc-big">−15%</b><span>Weekend deal<br /><small>applied at checkout</small></span></span>
            </div>
          </div>
          <div className="hc hc-gql" style={{ '--d': 14 }}>
            <div className="hc-in">
              <span className="hc-k"><BrandIcon name="graphql" size={13} /> GraphQL · storefront</span>
              <code><span>query</span> cart(id) {'{'} items total {'}'}</code>
              <span className="hc-row hc-ms"><i className="hc-dot" />Resolved <b>84 ms</b></span>
            </div>
          </div>
          <div className="hc hc-vitals" style={{ '--d': 22 }}>
            <div className="hc-in">
              <span className="hc-k">Storefront health</span>
              <svg viewBox="0 0 120 36" className="hc-spark"><path d="M0 30 L15 27 L30 28 L45 20 L60 22 L75 14 L90 15 L105 7 L120 5" pathLength="100" /></svg>
              <span className="hc-row">Core Web Vitals <em className="hc-ok">Good</em></span>
            </div>
          </div>
        </div>

        <div className="wrap stage-head">
          <span className="tag stage-tag">Adobe Certified Expert · 12+ years<span className="tag-more"> · 7 countries</span></span>
          {/* One h1 that carries the name, the role and the platform for search. */}
          <h1 className="hero-title">
            <span className="sr-only">Pushpendra Singh Sodha, Magento 2 and PHP developer. </span>
            <span className="words">{WORDS.map((w, i) => <Fragment key={w}><span className="w" style={{ '--i': i }}>{w}</span>{' '}</Fragment>)}</span>
            <RollingLine />
          </h1>
          <div className="ctas stage-ctas">
            <a href="#contact" onClick={scrollToHash} className="pill pill-primary">Discuss a role <span className="arr" aria-hidden="true">→</span></a>
            <a href="#projects" onClick={scrollToHash} className="pill stage-ghost">See my work</a>
          </div>
        </div>
      </div>

      <div className="wrap hero-grid" id="about-me">
        <Portrait />
        <div className="hero-copy">
          <p className="hero-lead">
            Magento 2 and PHP developer. I design the modules, ERP integrations and headless storefronts behind
            retailers in the UAE, Kuwait, Saudi Arabia, Lebanon, Australia, Russia and the USA.
          </p>
          <AskBox />
          <ul className="checks">
            {heroChecks.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
