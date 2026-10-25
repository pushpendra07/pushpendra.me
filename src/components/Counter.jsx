import { useEffect, useRef, useState } from 'react';
import useReducedMotion from '../hooks/useReducedMotion';

// Counts up to `to` with an ease-out curve once visible, then appends `suffix`.
export default function Counter({ to, suffix = '', className }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [text, setText] = useState(reduce ? `${to}${suffix}` : '0');

  useEffect(() => {
    if (reduce) { setText(`${to}${suffix}`); return undefined; }
    const el = ref.current;
    let raf = 0;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const t0 = performance.now();
      const dur = 1400;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - (1 - p) ** 3;
        setText(Math.round(to * eased) + (p === 1 ? suffix : ''));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, reduce]);

  return <span ref={ref} className={className}>{text}</span>;
}
