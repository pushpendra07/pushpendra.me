import { prefersReducedMotion } from '../hooks/useReducedMotion';

const NAV_OFFSET = 64;

// Click handler for in-page anchors: smooth-scrolls past the fixed header.
export function scrollToHash(e, onDone) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || href[0] !== '#') return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  onDone?.();
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - (href === '#home' ? 0 : NAV_OFFSET),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
  window.history.replaceState(null, '', href);
}
