import { useCallback, useEffect, useRef, useState } from 'react';
import { snippets } from '../data/profile';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import CodeTyper from './CodeTyper';
import TechIcon from './TechIcon';

// Chips ride a tilted ellipse around the editor (sizes in % of the visual).
// The upper half of the orbit passes behind the laptop, smaller and dimmer.
const RX = 46;
const RY = 40;
const TILT = (14 * Math.PI) / 180;
const PERIOD = 70000; // ms per revolution
const CHIP_DEPTH = 20; // pointer parallax, px

function place(theta) {
  const ex = RX * Math.cos(theta);
  const ey = RY * Math.sin(theta);
  const front = (Math.sin(theta) + 1) / 2; // 0 = far side, 1 = nearest
  return {
    x: ex * Math.cos(TILT) - ey * Math.sin(TILT),
    y: ex * Math.sin(TILT) + ey * Math.cos(TILT),
    scale: 0.82 + 0.18 * front,
    opacity: 0.35 + 0.65 * front,
    blur: (1 - front) * 1.6,
    z: front > 0.5 ? 3 : 1,
  };
}

const chipAngle = (i, n, turn) => turn * 2 * Math.PI + (i * 2 * Math.PI) / n - Math.PI / 2;

// Laptop editor, orbits and technology chips. The chips orbit the editor, switch
// to the stack of whichever snippet is being typed, and light up (with a beam from
// the editor) once the typed code mentions them. Layers with
// data-depth shift against the pointer for parallax (desktop pointers only).
export default function HeroVisual({ heroRef }) {
  const ref = useRef(null);
  const chipRefs = useRef([]);
  const beamRefs = useRef([]);
  const pointer = useRef({ x: 0, y: 0 });
  const [si, setSi] = useState(0);
  const [live, setLive] = useState(() => snippets[0].stack.map(() => false));
  const stack = snippets[si].stack;

  const onProgress = useCallback((index, typed, done) => {
    setSi(index);
    const next = snippets[index].stack.map((it) => (it.match ? typed.includes(it.match) : done));
    setLive((prev) => (prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const layers = ref.current.querySelectorAll('[data-depth]');
    let raf = 0;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      pointer.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const { x, y } = pointer.current;
        layers.forEach((l) => {
          const d = +l.dataset.depth;
          l.style.transform = `translate3d(${(-x * d).toFixed(1)}px,${(-y * d).toFixed(1)}px,0)`;
        });
      });
    };
    hero.addEventListener('pointermove', onMove);
    return () => { hero.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [heroRef]);

  // Orbit loop; idles while the hero is off screen.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(ref.current);
    let raf = 0;
    const t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const turn = ((now - t0) % PERIOD) / PERIOD;
      const { x: mx, y: my } = pointer.current;
      const chips = chipRefs.current.filter(Boolean);
      chips.forEach((el, i) => {
        const p = place(chipAngle(i, chips.length, turn));
        el.style.left = `${50 + p.x}%`;
        el.style.top = `${50 + p.y}%`;
        el.style.opacity = p.opacity.toFixed(3);
        el.style.zIndex = p.z;
        el.style.filter = p.blur > 0.05 ? `blur(${p.blur.toFixed(2)}px)` : 'none';
        el.style.transform = `translate(-50%,-50%) translate(${(-mx * CHIP_DEPTH).toFixed(1)}px,${(-my * CHIP_DEPTH).toFixed(1)}px) scale(${p.scale.toFixed(3)})`;
        const beam = beamRefs.current[i];
        if (beam) {
          beam.setAttribute('x2', (50 + p.x).toFixed(2));
          beam.setAttribute('y2', (50 + p.y).toFixed(2));
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <div ref={ref} className="hero-visual" aria-hidden="true">
      <div className="layer orbits" data-depth="6">
        <div className="orbit orbit--a"><div className="orbit-spin"><span className="orbit-dot" /></div></div>
        <div className="orbit orbit--b"><div className="orbit-spin"><span className="orbit-dot" /></div></div>
      </div>

      <div className="layer laptop" data-depth="14">
        <CodeTyper onProgress={onProgress} />
        <div className="laptop-base" />
        <div className="laptop-foot" />
      </div>

      {/* Beams from the editor to each lit chip; they pass behind the laptop. */}
      <svg className="chip-beams" viewBox="0 0 100 100" preserveAspectRatio="none">
        {stack.map((item, i) => {
          const p = place(chipAngle(i, stack.length, 0));
          return (
            <line
              key={`${si}-${item.label}-${live[i]}`}
              ref={(el) => { beamRefs.current[i] = el; }}
              className={`beam${live[i] ? ' is-firing' : ''}`}
              x1="50" y1="46" x2={50 + p.x} y2={50 + p.y}
              stroke={item.color}
            />
          );
        })}
      </svg>

      {stack.map((item, i) => {
        const p = place(chipAngle(i, stack.length, 0));
        return (
          <div
            // Slots stay mounted across snippets so the orbit loop keeps its elements.
            key={i}
            ref={(el) => { chipRefs.current[i] = el; }}
            className={`orbit-chip ${live[i] ? 'is-live' : 'is-idle'}`}
            style={{
              left: `${50 + p.x}%`, top: `${50 + p.y}%`, opacity: p.opacity, zIndex: p.z,
              transform: `translate(-50%,-50%) scale(${p.scale})`,
            }}
          >
            <div className="tech-card" style={{ animationDuration: `${6 + (i % 4)}s`, animationDelay: `${-i * 0.9}s`, '--chip': item.color }}>
              {/* Re-keyed per snippet and on lighting up, so each change fades in. */}
              <span key={`${si}-${item.label}-${live[i]}`} className="tech-swap">
                <TechIcon name={item.icon} color={item.color} />
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
