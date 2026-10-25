import { useEffect, useRef } from 'react';
import { techCards } from '../data/profile';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import CodeTyper from './CodeTyper';

// Laptop editor, orbits and floating tech chips. Layers with data-depth shift
// against the pointer for a parallax effect (desktop pointers only).
export default function HeroVisual({ heroRef }) {
  const ref = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const layers = ref.current.querySelectorAll('[data-depth]');
    let raf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        layers.forEach((l) => {
          const d = +l.dataset.depth;
          l.style.transform = `translate3d(${(-mx * d).toFixed(1)}px,${(-my * d).toFixed(1)}px,0)`;
        });
      });
    };
    hero.addEventListener('pointermove', onMove);
    return () => { hero.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [heroRef]);

  return (
    <div ref={ref} className="hero-visual" aria-hidden="true">
      <div className="layer orbits" data-depth="6">
        <div className="orbit orbit--a"><div className="orbit-spin"><span className="orbit-dot" /></div></div>
        <div className="orbit orbit--b"><div className="orbit-spin"><span className="orbit-dot" /></div></div>
      </div>

      <div className="layer laptop" data-depth="14">
        <CodeTyper />
        <div className="laptop-base" />
        <div className="laptop-foot" />
      </div>

      {techCards.map((t) => (
        <div key={t.label} className="layer tech-card-wrap" data-depth={t.depth} style={{ left: t.x, top: t.y }}>
          <div className="tech-card" style={{ animationDuration: t.dur, animationDelay: t.delay }}>
            <span className="tech-dot" style={{ background: t.dot }} />
            {t.label}
          </div>
        </div>
      ))}
    </div>
  );
}
