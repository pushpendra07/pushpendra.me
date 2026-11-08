// Light/dark theme. Light is the default; the inline script in index.html applies a saved
// "dark" choice before first paint. The device's own setting is not followed.
import { prefersReducedMotion } from '../hooks/useReducedMotion';

const KEY = 'theme';
// Browser UI colour per theme; matches --bg in styles.css.
const THEME_COLOR = { dark: '#0a0b14', light: '#ffffff' };

export const getTheme = () =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

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
      { duration: 500, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' },
    );
  }).catch(() => {});
}

const CHOICE_EVENT = 'themechoice';

// The visitor's choice: 'dark' only if they picked it, otherwise 'light'.
export const getChoice = () => (typeof window !== 'undefined' && saved() === 'dark' ? 'dark' : 'light');

export function subscribeChoice(onChange) {
  window.addEventListener(CHOICE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => { window.removeEventListener(CHOICE_EVENT, onChange); window.removeEventListener('storage', onChange); };
}

export function setChoice(choice, origin) {
  setTheme(choice, origin);
  window.dispatchEvent(new Event(CHOICE_EVENT));
}

// Applies and remembers a theme.
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
