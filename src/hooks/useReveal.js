import { useEffect } from 'react';
import { prefersReducedMotion } from './useReducedMotion';

// Fades/slides in every [data-reveal] element below the fold as it scrolls into view.
// Optional data-delay (ms) staggers items in a grid.
export default function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;
    const timers = [];
    const els = root.querySelectorAll('[data-reveal]');

    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      const d = +(el.getAttribute('data-delay') || 0);
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity .8s cubic-bezier(.2,.7,.2,1) ${d}ms, transform .8s cubic-bezier(.2,.7,.2,1) ${d}ms, border-color .35s, box-shadow .35s`;
      el.dataset.hidden = '1';
    });

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        if (el.dataset.hidden) {
          el.style.opacity = '1';
          el.style.transform = '';
          delete el.dataset.hidden;
          // Hand transitions back to the stylesheet so hover effects work normally.
          timers.push(setTimeout(() => { el.style.transition = ''; }, 1400));
        }
        obs.unobserve(el);
      }),
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));

    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [rootRef]);
}
