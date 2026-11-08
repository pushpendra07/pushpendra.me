import { useEffect } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

const CARDS = '.pcard, .wcard, .rcard, .feat, .steps li, .stat-tile';
const NUM = /^(\d{1,3}(?:,\d{3})*|\d+)(\+?)$/;

// Small touches that make the page feel alive without costing load time:
// a soft light that follows the pointer across cards, and numbers that count up once on screen.
export default function useAlive(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    // Pointer light: one listener, one frame per move, only on devices with a fine pointer.
    let raf = 0;
    let last = null;
    const onMove = (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const card = last.target.closest && last.target.closest(CARDS);
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${last.clientX - r.left}px`);
        card.style.setProperty('--my', `${last.clientY - r.top}px`);
      });
    };
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine) root.addEventListener('pointermove', onMove, { passive: true });

    // Count-up: [data-count] elements whose text is a plain number like 12+, 4 or 20,000.
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const el = en.target;
      const m = el.textContent.trim().match(NUM);
      if (!m) return;
      const to = +m[1].replace(/,/g, '');
      const comma = m[1].includes(',');
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1300);
        const v = Math.round(to * (1 - (1 - p) ** 3));
        el.textContent = (comma ? v.toLocaleString('en-US') : v) + m[2];
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    root.querySelectorAll('[data-count]').forEach((el) => io.observe(el));

    return () => {
      root.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [rootRef]);
}
