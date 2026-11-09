import { prefersReducedMotion } from '../hooks/useReducedMotion';

export function focusSection(section) {
  const heading = section.querySelector('h1, h2') ?? section;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  if (section.id === 'home') window.scrollTo({ top: 0, behavior: 'instant' });
  else section.scrollIntoView({ behavior: 'instant' });
}

// Click handler for in-page anchors. Menu navigation moves focus and scrolls together.
export function scrollToHash(e, closeMenu) {
  const href = e.currentTarget.getAttribute('href');
  if (!href || href[0] !== '#' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const el = document.getElementById(href.slice(1));
  if (!el) return;
  e.preventDefault();
  if (closeMenu) {
    closeMenu();
    focusSection(el);
  } else {
    const behavior = prefersReducedMotion() ? 'instant' : 'smooth';
    if (href === '#home') window.scrollTo({ top: 0, behavior });
    else el.scrollIntoView({ behavior });
  }
  window.history.replaceState(null, '', href);
}
