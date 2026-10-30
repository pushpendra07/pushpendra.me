// Light/dark theme. The inline script in index.html sets data-theme on <html> before first
// paint (saved choice, else the system setting); this module reads and changes it.
import { prefersReducedMotion } from '../hooks/useReducedMotion';

const KEY = 'theme';
const LIGHT_QUERY = '(prefers-color-scheme: light)';
// Browser UI colour per theme; matches --bg in styles.css.
const THEME_COLOR = { dark: '#06070d', light: '#fbfaff' };

export const getTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

function apply(theme) {
  const root = document.documentElement;
  // Drop transitions for a frame so the whole page swaps at once.
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

const saved = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

// Grows the new theme in a circle from `origin` ({ x, y } in viewport px). Falls back to an
// instant swap without the View Transitions API or with reduced motion.
function reveal(theme, origin) {
  if (!origin || !document.startViewTransition || prefersReducedMotion()) {
    apply(theme);
    return;
  }
  const { x, y } = origin;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => apply(theme));
  transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 550, easing: 'cubic-bezier(.2, .7, .2, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
}

// Saves an explicit choice; from then on the system setting is ignored.
export function setTheme(theme, origin) {
  reveal(theme, origin);
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    // Private mode: the choice lasts for this page only.
  }
}

// Calls `onChange` whenever data-theme changes, from any source.
export function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

// Follows system light/dark changes until the visitor picks a theme.
export function followSystem() {
  const mq = window.matchMedia(LIGHT_QUERY);
  const onChange = () => { if (!saved()) apply(mq.matches ? 'light' : 'dark'); };
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}
